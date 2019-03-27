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
  Registry,
} from '../types/Registry/Registry'

import {PLCRVoting} from '../types/Registry/PLCRVoting'

export function handleApplication(event: _Application): void {
  let id = event.params.listingHash.toHex()
  let listing = new Listing(id)
  listing.applicationExpiry = event.params.appEndDate
  listing.unstakedDeposit = event.params.deposit
  listing.data = event.params.data
  listing.whitelist = false
  listing.deleted = false

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

export function handleChallenge(event: _Challenge): void {
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

export function handleDeposit(event: _Deposit): void {
  let id = event.params.listingHash.toHex()
  let listing = Listing.load(id)
  listing.unstakedDeposit = event.params.newTotal
  listing.save()

  let userID = listing.owner.toHex()
  let user = User.load(userID)
  user.totalStaked = user.totalStaked.plus(event.params.added)
  user.save()
}

export function handleWithdrawal(event: _Withdrawal): void {
  let id = event.params.listingHash.toHex()
  let listing = Listing.load(id)
  listing.unstakedDeposit = event.params.newTotal
  listing.save()
}

export function handleApplicationWhitelisted(event: _ApplicationWhitelisted): void {
  let id = event.params.listingHash.toHex()
  let listing = Listing.load(id)
  listing.whitelist = true
  listing.save()
}

export function handleApplicationRemoved(event: _ApplicationRemoved): void {
  let id = event.params.listingHash.toHex()
  let listing = Listing.load(id)
  listing.deleted = true
  listing.save()
}

export function handleListingRemoved(event: _ListingRemoved): void {
  let id = event.params.listingHash.toHex()
  let listing = Listing.load(id)
  listing.deleted = true
  listing.save()
}

export function handleListingWithdrawn(event: _ListingWithdrawn): void {
  /* No work needs to be done here. This event always runs after
   * _ListingRemoved or _ApplicationRemoved, which will delete the listing
   * The extra data provided by ListingWithdrawn isn't that valuable
   * So it is ignored for now.
   */
}

export function handleTouchAndRemoved(event: _TouchAndRemoved): void {
  /* No work needs to be done here. This event always runs after
   * _ListingRemoved or _ApplicationRemoved, which will delete the listing
   * The extra data provided by touchAndRemove isn't that valuable
   * So it is ignored for now.
   */
}

export function handleChallengeFailed(event: _ChallengeFailed): void {
  let id = event.params.challengeID.toHex()
  let challenge = Challenge.load(id)
  challenge.resolved = true
  challenge.totalTokens = event.params.totalTokens
  challenge.rewardPool = event.params.rewardPool
  challenge.passed = false
  challenge.save()

  let listing = Listing.load(event.params.listingHash.toHex())
  let registry = Registry.bind(event.address)
  let storageListing = registry.listings(event.params.listingHash)
  listing.unstakedDeposit = storageListing.value3
  listing.save()

  let user = User.load(listing.owner.toHex())
  user.totalStaked = registry.totalStaked(listing.owner)
  user.save()
}

export function handleChallengeSucceeded(event: _ChallengeSucceeded): void {
  let id = event.params.challengeID.toHex()
  let challenge = Challenge.load(id)
  challenge.resolved = true
  challenge.totalTokens = event.params.totalTokens
  challenge.rewardPool = event.params.rewardPool
  challenge.passed = true
  challenge.save()
}

// note - reward amounts owned by each user is stored in PLCR voting. only totals stored in Registry
export function handleRewardClaimed(event: _RewardClaimed): void {
  let id = event.params.challengeID.toHex()
  let challenge = Challenge.load(id)

  let registry = Registry.bind(event.address)
  let challengeStorage = registry.challenges(event.params.challengeID)
  challenge.totalTokens = challengeStorage.value4
  challenge.rewardPool = challengeStorage.value0

  let votersClaimed = challenge.votersClaimed
  votersClaimed.push(event.params.voter)
  challenge.votersClaimed = votersClaimed
  challenge.votersClaimed

  challenge.save()
}

export function handleListingMigrated(event: _ListingMigrated): void {
  // Never emitted on mainnet, ignored for now
}
