// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PartyBidPunk2066 is ERC721URIStorage, Ownable {
  uint256 public tokenCounter;
  string public internalTokenURI;
  IERC20 public deadToken;
  mapping(address => bool) public minted;

  constructor(string memory _tokenURI, address _deadAddress)
    ERC721("DeadTokenNFT", "DTN")
  {
    tokenCounter = 0;
    internalTokenURI = _tokenURI;
    deadToken = IERC20(_deadAddress);
  }

  function mintCollectible() public returns (uint256) {
    // require(tokenCounter < 1000, "All tokens already minted");
    require(deadToken.balanceOf(msg.sender) > 0, "Owner doesn't have DEAD");
    require(minted[msg.sender] == false, "NFT already minted");
    minted[msg.sender] = true;

    uint256 newTokenId = tokenCounter;
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, internalTokenURI);

    tokenCounter = tokenCounter + 1;

    return newTokenId;
  }

  function hasBalance() public view returns (bool) {
    return deadToken.balanceOf(msg.sender) > 0;
  }
}
