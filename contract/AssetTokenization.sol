// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.7.0 <0.9.0;

contract AssetTokenization {
    // Define asset structure
    struct Asset {
        address owner;
        uint256 value;
        string assetType;
        // Add more details about the asset as needed
    }

    // Mapping from token ID to Asset
    mapping(uint256 => Asset) public assets;

    // Mapping from owner to list of owned token IDs
    mapping(address => uint256[]) public ownedTokens;

    // Event emitted when a new asset is tokenized
    event AssetTokenized(address indexed owner, uint256 indexed tokenId, uint256 value, string assetType);

    // Event emitted when an asset is transferred
    event AssetTransferred(address indexed from, address indexed to, uint256 indexed tokenId);

    // Function to tokenize a new asset
    function tokenizeAsset(address owner, uint256 tokenId, uint256 value, string memory assetType) public {
        // Ensure the token ID does not already exist
        require(assets[tokenId].owner == address(0), "Token ID already exists");

        // Create the new asset
        assets[tokenId] = Asset({
            owner: owner,
            value: value,
            assetType: assetType
        });

        // Update the owner's list of owned tokens
        ownedTokens[owner].push(tokenId);

        // Emit event
        emit AssetTokenized(owner, tokenId, value, assetType);
    }

    // Function to transfer an asset to another address
    function transferAsset(address from, address to, uint256 tokenId) public {
        // Ensure the sender is the current owner of the token
        require(assets[tokenId].owner == from, "Sender is not the owner");

        // Update the asset's owner
        assets[tokenId].owner = to;

        // Update the sender's list of owned tokens
        uint256[] storage fromTokens = ownedTokens[from];
        for (uint256 i = 0; i < fromTokens.length; i++) {
            if (fromTokens[i] == tokenId) {
                fromTokens[i] = fromTokens[fromTokens.length - 1];
                fromTokens.pop();
                break;
            }
        }

        // Update the receiver's list of owned tokens
        ownedTokens[to].push(tokenId);

        // Emit event
        emit AssetTransferred(from, to, tokenId);
    }
}
