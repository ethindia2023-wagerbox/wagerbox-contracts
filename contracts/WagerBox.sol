pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WagerBoxContract {
    struct Question {
        bool isEnded;
        bool correctAnswer;
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

    constructor(IERC20 _token) {
        token = _token;
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
        // Additional game start logic here
    }

    function watchGame(uint256 matchId) public view {
        require(matches[matchId].isInit, "Match not initialized");
        // Watching game logic here (may involve events or external calls)
    }

    function createQuestion(uint256 matchId) public {
        Match storage m = matches[matchId];
        require(m.isInit, "Match not initialized");
        require(m.owner != msg.sender, "owner cannot create questions");

        m.questions[m.nextQuestionId].isEnded = false;
        m.questions[m.nextQuestionId].totalStaked = 0;
        m.nextQuestionId++;
        emit QuestionCreated(matchId, questionId);
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
        // Logic to payout winners
        // This could involve iterating over the answers and transferring tokens
    }

    // ... other functions ...
}
