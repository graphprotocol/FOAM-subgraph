// right now there are no events for this emitted by mainnet

// import {
//   Transfer
// } from '../types/signalToken/signalToken'
//
// export function handleTransfer(event: Transfer): void {
// }


import {BigInt} from '@graphprotocol/graph-ts'
import {User, Listing, Challenge} from '../types/schema'
import {
  _Application,
  _Challenge,
  _Deposit,
  _Withdrawal,
  _ApplicationWhitelisted,
  _ApplicationRemoved,
  _ListingRemoved,
  _ListingWithdrawn,
  _TouchAndRemoved,
  _ChallengeFailed,
  _ChallengeSucceeded,
  _RewardClaimed,
  _ListingMigrated
} from '../types/Registry/Registry'


export function handleApplication(event: _Application): void{
  // let id = event.params.who.toHex()
  // let inviter = Invite.load(id)
  // if (inviter == null){
  //   inviter = new Invite(id)
  //   inviter.inviteBalance = BigInt.fromI32(0)
  //   inviter.invites = []
  // }
  // inviter.inviteBalance = event.params.amount
  // inviter.save()
}

export function handleChallenge(event: _Challenge): void{

}

export function handleDeposit(event: _Deposit): void{

}

export function handleWithdrawal(event: _Withdrawal): void{

}

export function handleApplicationWhitelisted(event: _ApplicationWhitelisted): void{

}

export function handleApplicationRemoved(event: _ApplicationRemoved): void{

}

export function handleListingRemoved(event: _ListingRemoved): void{

}

export function handleListingWithdrawn(event: _ListingWithdrawn): void{

}

export function handleTouchAndRemoved(event: _TouchAndRemoved): void{

}

export function handleChallengeFailed(event: _ChallengeFailed): void{

}

export function handleChallengeSucceeded(event: _ChallengeSucceeded): void{

}

export function handleRwardClaimed(event: _RewardClaimed): void{

}

export function handleListingMigrated(event: _ListingMigrated): void{

}
