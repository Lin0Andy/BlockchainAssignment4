# Assignment 4, ERC20 token, Report:

## Testing, explanation and result

<h6>Should deploy with correct initial state:</h6>
<p>
This test verifies that the token contract deploys successfully with the expected initial state, including the correct name, symbol, total supply, and the balance of the owner.
</p>
<h6>Should transfer tokens between accounts</h6>
<p>
This test ensures that tokens can be transferred successfully between different accounts. It transfers tokens from one account to another and checks if the balances are updated accordingly.
</p>
<h6>Should not transfer tokens if sender does not have enough balance</h6>
<p>
This test checks whether the contract correctly reverts the transaction if the sender does not have enough tokens to complete the transfer. It expects the transaction to revert with the error message "ERC20: transfer amount exceeds balance".
</p>
<h6>Should not allow transferring to the token contract address</h6>
<p>
This test verifies that the contract prevents transfers to its own address to avoid potential issues. It expects the transaction to revert with the error message "ERC20: transfer to the token contract"
</p>
<h6>Should not allow setting block reward by non-owner</h6>
<p>
This test ensures that only the contract owner can set the block reward amount. It expects the transaction to revert with the error message "Ownable: caller is not the owner" when a non-owner attempts to set the block reward.
</p>
<h6>Should mint tokens as miner reward</h6>
<p>
This test verifies that tokens can be minted as a miner reward. It sets a block reward, mints tokens as a miner reward, and checks if the owner's balance is updated accordingly.
</p>
<h6>Should not allow destroying contract by non-owner</h6>
<p>
This test checks that only the contract owner can destroy the contract. It expects the transaction to revert with the error message "Ownable: caller is not the owner" when a non-owner attempts to destroy the contract.
</p>
<h6>Should destroy contract and transfer remaining tokens to owner:</h6>
<p>
This test ensures that the contract can be destroyed, and any remaining tokens are transferred to the owner. It verifies that the total supply becomes zero after destruction and that the owner's balance increases.
</p>

