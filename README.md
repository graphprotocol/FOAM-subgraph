# FOAM-subgraph
The FOAM Proof of Location protocol empowers a permissionless and autonomous network of radio beacons that can offer secure location services. 

## Queries

```graphql
{
  polls {
    id
    creator
    commitEndDate
    revealEndDate
    voteQuorum
    votesFor
    votesAgainst
    didCommit
    didReveal
    totalTokens
    # challenge{}
    # votes{}
  }
  votes {
    id
    pollID
    user
    numTokens
    votedFor
    revealed
  }
  challenges {
    id
    rewardPool
    challenger
    resolved
    stake
    totalTokens
    votersClaimed
    data
    passed
    # poll{}
  }
  listings{
    id
    owner
    whitelist
    applicationExpiry
    unstakedDeposit
    data
    challengeID
    deleted
    # challenges{}
  }
  users{
    id
    numApplications
    totalStaked
    # listings {}
    # challenges{}
    # createdPolls {}
    # votes {}
    totalVotes
    lockedVotes
    foamBalance
    # signals {}
  }
  signals{
    id
    owner
    cst
    nftAddress
    geohash
    radius
  }
}

```