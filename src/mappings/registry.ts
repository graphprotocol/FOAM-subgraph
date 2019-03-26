import {BigInt,Address} from '@graphprotocol/graph-ts'
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
  _ListingMigrated,
  Registry
} from '../types/Registry/Registry'

export function handleApplication(event: _Application): void{
  let id = event.params.listingHash.toHex()
  let listing = new Listing(id)
  listing.expiry = event.params.appEndDate
  listing.unstakedDeposit = event.params.deposit
  listing.data = event.params.data
  listing.whitelist = false

  let registry = Registry.bind(event.address)
  let storageListing = registry.listings(event.params.listingHash)
  listing.owner = storageListing.value2
  listing.save()

  let userID = listing.owner.toHex()
  let user = User.load(userID)
  if (user == null){
    user = new User(userID)
    user.foamBalance = BigInt.fromI32(0)
    user.signalBalance = BigInt.fromI32(0)
    user.numApplications = BigInt.fromI32(0)
    user.totalStaked = BigInt.fromI32(0)
    user.listings = []
    user.challenges = []
  }

  user.numApplications = registry.numApplications(Address.fromString(userID))
  user.totalStaked = registry.totalStaked(Address.fromString(userID))
  user.save()
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
