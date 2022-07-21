var SquareVerifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var verifierProof = require("../../zokrates/code/square/proof.json");

contract("SolnSquareVerifier", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];

  const BASE_TOKEN_URI =
    "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

  const TOKEN_NAME = "Enigma Token";
  const TOKEN_SYMBOL = "ENT";

  describe("SolnSquareVerifier", function () {
    beforeEach(async function () {
      try {
        let verifier = await SquareVerifier.new({ from: account_one });
        this.contract = await SolnSquareVerifier.new(
          verifier.address,
          TOKEN_NAME,
          TOKEN_SYMBOL,
          { from: account_one }
        );
      } catch (error) {
        console.log(error);
      }
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it("should add a new solution", async function () {
      try {
        const result = await this.contract.addSolution(
          verifierProof.proof.a,
          verifierProof.proof.b,
          verifierProof.proof.c,
          verifierProof.inputs,
          { from: account_one }
        );
        let eventName = result.logs[0].event;

        assert.equal(eventName, "SolutionAdded", "Solution addition failed");
      } catch (error) {
        console.log("Error occured", error);
      }
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("should mint a new token", async function () {
      let a = verifierProof.inputs[0];
      let b = verifierProof.inputs[1];

      await this.contract.addSolution(
        verifierProof.proof.a,
        verifierProof.proof.b,
        verifierProof.proof.c,
        verifierProof.inputs,
        { from: account_one }
      );

      await this.contract.mintNFT(a, b, account_two, { from: account_one });
      let balance = await this.contract.balanceOf(account_two);
      assert.equal(
        parseInt(balance),
        1,
        "Expected Token Balance is not correct."
      );
    });
  });
});
