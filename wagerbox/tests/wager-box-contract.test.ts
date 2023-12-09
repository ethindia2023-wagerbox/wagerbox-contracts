import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { AnswerDeclared } from "../generated/schema"
import { AnswerDeclared as AnswerDeclaredEvent } from "../generated/WagerBoxContract/WagerBoxContract"
import { handleAnswerDeclared } from "../src/wager-box-contract"
import { createAnswerDeclaredEvent } from "./wager-box-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let matchId = BigInt.fromI32(234)
    let questionId = BigInt.fromI32(234)
    let correctAnswer = "boolean Not implemented"
    let newAnswerDeclaredEvent = createAnswerDeclaredEvent(
      matchId,
      questionId,
      correctAnswer
    )
    handleAnswerDeclared(newAnswerDeclaredEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AnswerDeclared created and stored", () => {
    assert.entityCount("AnswerDeclared", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AnswerDeclared",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "matchId",
      "234"
    )
    assert.fieldEquals(
      "AnswerDeclared",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "questionId",
      "234"
    )
    assert.fieldEquals(
      "AnswerDeclared",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "correctAnswer",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
