import {BigInt,Address} from '@graphprotocol/graph-ts'
import {User, Poll, Vote} from '../types/schema'
import {
  _VoteCommitted,
  _VoteRevealed,
  _PollCreated,
  _VotingRightsGranted,
  _VotingRightsWithdrawn,
  _TokensRescued
} from '../types/PLCRVoting/PLCRVoting'


export function handleVoteCommitted(event: _VoteCommitted): void{
  let pollID = event.params.pollID.toHex()
  let poll = Poll.load(pollID)
  let commits = poll.didCommit
  commits.push(event.params.voter)
  poll.didCommit = commits
  poll.totalTokens = poll.totalTokens.plus(event.params.numTokens)
  poll.challenge = pollID
  poll.save()

  let voteID = event.params.pollID.toString().concat('-').concat(event.params.voter.toHex())
  let vote = new Vote(voteID)
  vote.pollID = event.params.pollID
  vote.numTokens = event.params.numTokens
  vote.save()
}


export function handleVoteRevealed(event: _VoteRevealed): void{
  let pollID = event.params.pollID.toHex()
  let poll = Poll.load(pollID)
  let reveals = poll.didReveal
  reveals.push(event.params.voter)
  poll.didReveal = reveals
  poll.votesFor = event.params.votesFor
  poll.votesAgainst = event.params.votesAgainst
  poll.save()

  let voteID = event.params.pollID.toString().concat('-').concat(event.params.voter.toHex())
  let vote = new Vote(voteID)
  if (event.params.choice == BigInt.fromI32(1)) {
    vote.votedFor = true
  } else {
    vote.votedFor = false
  }
  vote.save()
}

export function handlePollCreated(event: _PollCreated): void{
  let id = event.params.pollID.toHex()
  let poll = new Poll(id)
  poll.voteQuorum  = event.params.voteQuorum
  poll.commitEndDate = event.params.commitEndDate
  poll.revealEndDate = event.params.revealEndDate
  poll.creator = event.params.creator
  poll.votesFor = BigInt.fromI32(0)
  poll.votesAgainst = BigInt.fromI32(0)
  poll.totalTokens = BigInt.fromI32(0)
  poll.votes = []
  poll.didReveal = []
  poll.didCommit = []
  poll.save()
}


export function handleVotingRightsGranted(event: _VotingRightsGranted): void{
  let id = event.params.voter.toHex()
  let user = User.load(id) // user should exist, since tokens have been delegated here
  user.totalVotes = user.totalVotes.plus(event.params.numTokens)
  user.save()
}


export function handleVotingRightsWithdrawn(event: _VotingRightsWithdrawn): void{
  let id = event.params.voter.toHex()
  let user = User.load(id) // user should exist, since tokens have been delegated here
  user.totalVotes = user.totalVotes.minus(event.params.numTokens)
  user.save()
}


export function handleTokensRescued(event: _TokensRescued): void{

  // TODO - need to understand how the DLL and store works, and then I can record LOCKED tokens for users


}