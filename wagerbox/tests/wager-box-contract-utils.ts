import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  AnswerDeclared,
  GameStarted,
  MatchCreated,
  OwnershipTransferRequested,
  OwnershipTransferred,
  QuestionAnswered,
  QuestionCreated,
  QuestionEnded,
  QuestionReceived,
  QuestionSent,
  WinnersPayout
} from "../generated/WagerBoxContract/WagerBoxContract"

export function createAnswerDeclaredEvent(
  matchId: BigInt,
  questionId: BigInt,
  correctAnswer: boolean
): AnswerDeclared {
  let answerDeclaredEvent = changetype<AnswerDeclared>(newMockEvent())

  answerDeclaredEvent.parameters = new Array()

  answerDeclaredEvent.parameters.push(
    new ethereum.EventParam(
      "matchId",
      ethereum.Value.fromUnsignedBigInt(matchId)
    )
  )
  answerDeclaredEvent.parameters.push(
    new ethereum.EventParam(
      "questionId",
      ethereum.Value.fromUnsignedBigInt(questionId)
    )
  )
  answerDeclaredEvent.parameters.push(
    new ethereum.EventParam(
      "correctAnswer",
      ethereum.Value.fromBoolean(correctAnswer)
    )
  )

  return answerDeclaredEvent
}

export function createGameStartedEvent(matchId: BigInt): GameStarted {
  let gameStartedEvent = changetype<GameStarted>(newMockEvent())

  gameStartedEvent.parameters = new Array()

  gameStartedEvent.parameters.push(
    new ethereum.EventParam(
      "matchId",
      ethereum.Value.fromUnsignedBigInt(matchId)
    )
  )

  return gameStartedEvent
}

export function createMatchCreatedEvent(
  matchId: BigInt,
  owner: Address
): MatchCreated {
  let matchCreatedEvent = changetype<MatchCreated>(newMockEvent())

  matchCreatedEvent.parameters = new Array()

  matchCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "matchId",
      ethereum.Value.fromUnsignedBigInt(matchId)
    )
  )
  matchCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return matchCreatedEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent = changetype<OwnershipTransferRequested>(
    newMockEvent()
  )

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createQuestionAnsweredEvent(
  matchId: BigInt,
  questionId: BigInt,
  user: Address,
  answer: boolean
): QuestionAnswered {
  let questionAnsweredEvent = changetype<QuestionAnswered>(newMockEvent())

  questionAnsweredEvent.parameters = new Array()

  questionAnsweredEvent.parameters.push(
    new ethereum.EventParam(
      "matchId",
      ethereum.Value.fromUnsignedBigInt(matchId)
    )
  )
  questionAnsweredEvent.parameters.push(
    new ethereum.EventParam(
      "questionId",
      ethereum.Value.fromUnsignedBigInt(questionId)
    )
  )
  questionAnsweredEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  questionAnsweredEvent.parameters.push(
    new ethereum.EventParam("answer", ethereum.Value.fromBoolean(answer))
  )

  return questionAnsweredEvent
}

export function createQuestionCreatedEvent(
  matchId: BigInt,
  questionId: BigInt
): QuestionCreated {
  let questionCreatedEvent = changetype<QuestionCreated>(newMockEvent())

  questionCreatedEvent.parameters = new Array()

  questionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "matchId",
      ethereum.Value.fromUnsignedBigInt(matchId)
    )
  )
  questionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "questionId",
      ethereum.Value.fromUnsignedBigInt(questionId)
    )
  )

  return questionCreatedEvent
}

export function createQuestionEndedEvent(
  matchId: BigInt,
  questionId: BigInt
): QuestionEnded {
  let questionEndedEvent = changetype<QuestionEnded>(newMockEvent())

  questionEndedEvent.parameters = new Array()

  questionEndedEvent.parameters.push(
    new ethereum.EventParam(
      "matchId",
      ethereum.Value.fromUnsignedBigInt(matchId)
    )
  )
  questionEndedEvent.parameters.push(
    new ethereum.EventParam(
      "questionId",
      ethereum.Value.fromUnsignedBigInt(questionId)
    )
  )

  return questionEndedEvent
}

export function createQuestionReceivedEvent(
  messageId: Bytes,
  sourceChainSelector: BigInt,
  sender: Address,
  text: string
): QuestionReceived {
  let questionReceivedEvent = changetype<QuestionReceived>(newMockEvent())

  questionReceivedEvent.parameters = new Array()

  questionReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "messageId",
      ethereum.Value.fromFixedBytes(messageId)
    )
  )
  questionReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "sourceChainSelector",
      ethereum.Value.fromUnsignedBigInt(sourceChainSelector)
    )
  )
  questionReceivedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  questionReceivedEvent.parameters.push(
    new ethereum.EventParam("text", ethereum.Value.fromString(text))
  )

  return questionReceivedEvent
}

export function createQuestionSentEvent(
  messageId: Bytes,
  destinationChainSelector: BigInt,
  receiver: Address,
  text: string,
  feeToken: Address,
  fees: BigInt
): QuestionSent {
  let questionSentEvent = changetype<QuestionSent>(newMockEvent())

  questionSentEvent.parameters = new Array()

  questionSentEvent.parameters.push(
    new ethereum.EventParam(
      "messageId",
      ethereum.Value.fromFixedBytes(messageId)
    )
  )
  questionSentEvent.parameters.push(
    new ethereum.EventParam(
      "destinationChainSelector",
      ethereum.Value.fromUnsignedBigInt(destinationChainSelector)
    )
  )
  questionSentEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  questionSentEvent.parameters.push(
    new ethereum.EventParam("text", ethereum.Value.fromString(text))
  )
  questionSentEvent.parameters.push(
    new ethereum.EventParam("feeToken", ethereum.Value.fromAddress(feeToken))
  )
  questionSentEvent.parameters.push(
    new ethereum.EventParam("fees", ethereum.Value.fromUnsignedBigInt(fees))
  )

  return questionSentEvent
}

export function createWinnersPayoutEvent(
  matchId: BigInt,
  questionId: BigInt
): WinnersPayout {
  let winnersPayoutEvent = changetype<WinnersPayout>(newMockEvent())

  winnersPayoutEvent.parameters = new Array()

  winnersPayoutEvent.parameters.push(
    new ethereum.EventParam(
      "matchId",
      ethereum.Value.fromUnsignedBigInt(matchId)
    )
  )
  winnersPayoutEvent.parameters.push(
    new ethereum.EventParam(
      "questionId",
      ethereum.Value.fromUnsignedBigInt(questionId)
    )
  )

  return winnersPayoutEvent
}
