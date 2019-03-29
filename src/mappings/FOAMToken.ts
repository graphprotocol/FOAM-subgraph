import {Transfer} from '../types/FOAMToken/FOAMToken'
import {User} from '../types/schema'
import {BigInt} from "@graphprotocol/graph-ts/index";

export function handleTransfer(event: Transfer): void {
  let toID = event.params.to.toHex()
  let userTo = User.load(toID)
  if (userTo == null){
    userTo = new User(toID)
    userTo.foamBalance = BigInt.fromI32(0)
    userTo.numApplications = BigInt.fromI32(0)
    userTo.totalStaked = BigInt.fromI32(0)
    userTo.listings = []
    userTo.challenges = []
    userTo.votes = []
    userTo.createdPolls = []
    userTo.signals = []
    userTo.totalVotes = BigInt.fromI32(0)
    userTo.lockedVotes = BigInt.fromI32(0)
  }
  userTo.foamBalance = userTo.foamBalance.plus(event.params.value)
  userTo.save()

  let fromID = event.params.from.toHex()

  if (fromID != "0x0000000000000000000000000000000000000000") { // ignoring initial mint from 0 addr
    let userFrom = User.load(fromID)
    userFrom.foamBalance = userFrom.foamBalance.minus(event.params.value)
    userFrom.save()
  }
}

// We don't bother tracking approvals, because VotingRights represent this, and
// fail if approval does not exist. Therefore the only approvals core to the protocol
// are tracked in VotingRights, and thus generalized approvals need not be tracked here

// export function handleApproval(event: Approval): void {
//
// }

