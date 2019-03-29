import {Transfer, TrackedToken} from '../types/SignalToken/SignalToken'
import {Signal} from '../types/schema'

// Transfer handles all transfers, burns (to 0 addr), and mints (from 0 addr)
export function handleTransfer(event: Transfer): void {
  let id = event.params._tokenId.toHex()
  let signal = Signal.load(id)
  signal.owner = event.params._to
  signal.save()
}

export function handleTrackedToken(event: TrackedToken): void {
  let id = event.params.tokenID.toHex()
  let signal = Signal.load(id)
  signal.cst = event.params.cst
  signal.nftAddress = event.params.nftAddress
  signal.geohash = event.params.geohash
  signal.radius = event.params.radius
  signal.save()
}
