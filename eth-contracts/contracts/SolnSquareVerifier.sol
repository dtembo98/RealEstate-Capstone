pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    Verifier private _verifier;

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public CustomERC721Token(name, symbol) {
        // TODO initialize the contract with the zokrates generated solidity contract <Verifier> or <renamedVerifier>
        _verifier = Verifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 solutionIndex;
        address solutionOwner;
        bool isCorrect;
        bool isMinted;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(
        uint256 indexed solutionIndex,
        address indexed solutionOwner
    );

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        // make sure the solution is unique
        bytes32 uniqueSolutionKey = keccak256(
            abi.encodePacked(input[0], input[1])
        );
        require(
            uniqueSolutions[uniqueSolutionKey].isCorrect == false,
            "Solution already exists"
        );

        bool verified = _verifier.verifyTx(a, b, c, input);
        uint256 solutionIndex = solutions.length;

        require(verified, "Solution is not correct");

        Solution memory solution = Solution({
            solutionIndex: solutionIndex,
            solutionOwner: msg.sender,
            isCorrect: true,
            isMinted: false
        });
        solutions.push(solution);
        uniqueSolutions[uniqueSolutionKey] = solution;
        emit SolutionAdded(solutionIndex, msg.sender);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNFT(
        uint256 a,
        uint256 b,
        address to
    ) public {
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b));

        require(
            uniqueSolutions[solutionKey].isMinted == false,
            "Solution has already been minted"
        );

        uint256 tokenId = uniqueSolutions[solutionKey].solutionIndex;
        _mint(to, tokenId);
        uniqueSolutions[solutionKey].isMinted = true;
    }
}
