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
  listing.applicationExpiry = event.params.appEndDate
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
  let listing = Listing.load(event.params.listingHash.toHex())
  listing.challengeID = event.params.challengeID
  listing.unstakedDeposit = listing.unstakedDeposit.minus(event.params.deposit)
  listing.save()

  // chalennge gets created (event contains, plus call into
  let challenge = new Challenge(event.params.challengeID.toHex())
  let registry = Registry.bind(event.address)
  let storageChallenge = registry.challenges(event.params.challengeID)
  challenge.rewardPool = storageChallenge.value0
  challenge.challenger = storageChallenge.value1
  challenge.resolved = storageChallenge.value2
  challenge.stake = storageChallenge.value3
  challenge.totalTokens = storageChallenge.value4
  challenge.votersClaimed = []
  challenge.data = event.params.data
  challenge.save()

  let userID = challenge.challenger.toHex()
  let user = User.load(userID)
  if (user == null){
    user = new User(userID)
    user.foamBalance = BigInt.fromI32(0)
    user.signalBalance = BigInt.fromI32(0)
    user.numApplications = BigInt.fromI32(0)
    user.totalStaked = BigInt.fromI32(0)
    user.listings = []
    user.challenges = []
    user.save()
    // note - user doesn't stake or apply here, those have to do with listing. so it is okay
    // the user is populated with 0 for everything
  }
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

export function handleRewardClaimed(event: _RewardClaimed): void{

}

export function handleListingMigrated(event: _ListingMigrated): void{

}
