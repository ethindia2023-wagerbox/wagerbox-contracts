pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// sender contract
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/// receiver contract
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";


contract WagerBoxContract is CCIPReceiver, OwnerIsCreator {
    struct Question {
        bool isEnded;
        bool correctAnswer;
        string YNquestion;
        mapping(address => bool) answers;
        uint256 totalStaked;
    }

    struct Match {
        bool isInit;
        uint256 id;
        string detailsIpfsUrl;
        address owner;
        uint256 numPlayers;
        uint256 playerStake;
        uint256 userStake;
        mapping(uint256 => Question) questions;
        uint256 nextQuestionId;
    }

    IERC20 public token;
    mapping(uint256 => Match) public matches;
    uint256 public nextMatchId;

    // Events
    event MatchCreated(uint256 indexed matchId, address owner);
    event GameStarted(uint256 indexed matchId);
    event QuestionCreated(uint256 indexed matchId, uint256 questionId);
    event QuestionAnswered(
        uint256 indexed matchId,
        uint256 questionId,
        address user,
        bool answer
    );
    event QuestionEnded(uint256 indexed matchId, uint256 questionId);
    event AnswerDeclared(
        uint256 indexed matchId,
        uint256 questionId,
        bool correctAnswer
    );
    event WinnersPayout(uint256 indexed matchId, uint256 questionId);

    // Event emitted when a message is received from another chain.
    event QuestionReceived(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        string text // The text that was received.
    );
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    event QuestionSent(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        string text, // The text being sent.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the CCIP message.
    );
    bytes32 private s_lastReceivedMessageId; // Store the last received messageId.

    IRouterClient private s_router;
    LinkTokenInterface private s_linkToken;

    constructor(IERC20 _token, address _router, address _link) CCIPReceiver(_router) {
        token = _token;
        s_router = IRouterClient(_router);
        s_linkToken = LinkTokenInterface(_link);
    }

    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        s_lastReceivedMessageId = any2EvmMessage.messageId; // fetch the messageId
        (uint256 matchId, string memory ynQuestion) = abi.decode(any2EvmMessage.data, (uint256, string));

        createQuestion(matchId, ynQuestion);

        emit QuestionReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // fetch the source chain identifier (aka selector)
            abi.decode(any2EvmMessage.sender, (address)), // abi-decoding of the sender address,
            abi.decode(any2EvmMessage.data, (string))
        );
    }

    function sendQuestion(
        uint64 destinationChainSelector,
        address receiver,
        uint256 matchId,
        string calldata text
    ) external onlyOwner returns (bytes32 messageId) {
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver), // ABI-encoded receiver address
            data: abi.encode(matchId, text), // ABI-encoded string
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array indicating no tokens are being sent
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1(200_000)
            ),
            feeToken: address(s_linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = s_router.getFee(
            destinationChainSelector,
            evm2AnyMessage
        );

        if (fees > s_linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);

        // approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
        s_linkToken.approve(address(s_router), fees);

        // Send the message through the router and store the returned message ID
        messageId = s_router.ccipSend(destinationChainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit QuestionSent(
            messageId,
            destinationChainSelector,
            receiver,
            text,
            address(s_linkToken),
            fees
        );

        // Return the message ID
        return messageId;
    }

    function createMatch(
        string memory detailsIpfsUrl,
        uint256 playerStake
    ) public {
        Match storage m = matches[nextMatchId];
        m.isInit = true;
        m.id = nextMatchId;
        m.detailsIpfsUrl = detailsIpfsUrl;
        m.owner = msg.sender;
        m.playerStake = playerStake;
        m.userStake = 0;
        emit MatchCreated(nextMatchId, msg.sender);
        nextMatchId++;
    }

    function playerStake(uint256 matchId) public view returns (uint256) {
        require(matches[matchId].isInit, "Match not initialized");
        return matches[matchId].playerStake;
    }

    function startGame(uint256 matchId) public {
        Match storage m = matches[matchId];
        require(m.isInit, "Match not initialized");
        require(m.owner == msg.sender, "Only owner can start the game");
    }

    function watchGame(uint256 matchId) public view {
        require(matches[matchId].isInit, "Match not initialized");
    }

    function createQuestion(uint256 matchId, string memory ynQuestion) public {
        Match storage m = matches[matchId];
        require(m.isInit, "Match not initialized");
        require(m.owner != msg.sender, "owner cannot create questions");

        uint256 currentQuestionId = m.nextQuestionId;
        m.questions[currentQuestionId].isEnded = false;
        m.questions[currentQuestionId].YNquestion = ynQuestion;
        m.questions[currentQuestionId].totalStaked = 0;
        m.nextQuestionId++;
        emit QuestionCreated(matchId, currentQuestionId);
    }

    function answerQuestion(
        uint256 matchId,
        uint256 questionId,
        bool answer
    ) public {
        Match storage m = matches[matchId];
        require(m.isInit, "Match not initialized");
        require(!m.questions[questionId].isEnded, "Question already ended");

        // Check if the sender has already answered the question
        require(
            !hasAnswered(matchId, questionId, msg.sender),
            "Already answered this question"
        );

        m.questions[questionId].answers[msg.sender] = answer;
        emit QuestionAnswered(matchId, questionId, msg.sender, answer);
        // Handle staking or token transfer logic here
    }

    function hasAnswered(
        uint256 matchId,
        uint256 questionId,
        address user
    ) public view returns (bool) {
        return matches[matchId].questions[questionId].answers[user];
    }

    function endQuestion(uint256 matchId, uint256 questionId) public {
        Match storage m = matches[matchId];
        require(m.isInit, "Match not initialized");
        require(m.owner == msg.sender, "Only owner can end questions");

        m.questions[questionId].isEnded = true;
        emit QuestionEnded(matchId, questionId);
        // Additional logic for ending a question
    }

    function declareAnswer(
        uint256 matchId,
        uint256 questionId,
        bool correctAnswer
    ) public {
        Match storage m = matches[matchId];
        require(m.isInit, "Match not initialized");
        require(m.owner == msg.sender, "Only owner can declare answers");

        m.questions[questionId].correctAnswer = correctAnswer;
        emit AnswerDeclared(matchId, questionId, correctAnswer);
        // Additional logic for declaring an answer
    }

    function payoutWinners(uint256 matchId, uint256 questionId) public {
        Match storage m = matches[matchId];
        require(m.isInit, "Match not initialized");
        require(m.questions[questionId].isEnded, "Question not ended");

        Question storage q = m.questions[questionId];
        emit WinnersPayout(matchId, questionId);
    }
}
