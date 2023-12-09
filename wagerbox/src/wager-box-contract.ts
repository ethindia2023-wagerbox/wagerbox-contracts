import {
  AnswerDeclared as AnswerDeclaredEvent,
  GameStarted as GameStartedEvent,
  MatchCreated as MatchCreatedEvent,
  OwnershipTransferRequested as OwnershipTransferRequestedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  QuestionAnswered as QuestionAnsweredEvent,
  QuestionCreated as QuestionCreatedEvent,
  QuestionEnded as QuestionEndedEvent,
  QuestionReceived as QuestionReceivedEvent,
  QuestionSent as QuestionSentEvent,
  WinnersPayout as WinnersPayoutEvent
} from "../generated/WagerBoxContract/WagerBoxContract"
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
} from "../generated/schema"

export function handleAnswerDeclared(event: AnswerDeclaredEvent): void {
  let entity = new AnswerDeclared(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.matchId = event.params.matchId
  entity.questionId = event.params.questionId
  entity.correctAnswer = event.params.correctAnswer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGameStarted(event: GameStartedEvent): void {
  let entity = new GameStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.matchId = event.params.matchId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMatchCreated(event: MatchCreatedEvent): void {
  let entity = new MatchCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.matchId = event.params.matchId
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferRequested(
  event: OwnershipTransferRequestedEvent
): void {
  let entity = new OwnershipTransferRequested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestionAnswered(event: QuestionAnsweredEvent): void {
  let entity = new QuestionAnswered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.matchId = event.params.matchId
  entity.questionId = event.params.questionId
  entity.user = event.params.user
  entity.answer = event.params.answer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestionCreated(event: QuestionCreatedEvent): void {
  let entity = new QuestionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.matchId = event.params.matchId
  entity.questionId = event.params.questionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestionEnded(event: QuestionEndedEvent): void {
  let entity = new QuestionEnded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.matchId = event.params.matchId
  entity.questionId = event.params.questionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestionReceived(event: QuestionReceivedEvent): void {
  let entity = new QuestionReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.messageId = event.params.messageId
  entity.sourceChainSelector = event.params.sourceChainSelector
  entity.sender = event.params.sender
  entity.text = event.params.text

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestionSent(event: QuestionSentEvent): void {
  let entity = new QuestionSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.messageId = event.params.messageId
  entity.destinationChainSelector = event.params.destinationChainSelector
  entity.receiver = event.params.receiver
  entity.text = event.params.text
  entity.feeToken = event.params.feeToken
  entity.fees = event.params.fees

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWinnersPayout(event: WinnersPayoutEvent): void {
  let entity = new WinnersPayout(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.matchId = event.params.matchId
  entity.questionId = event.params.questionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
