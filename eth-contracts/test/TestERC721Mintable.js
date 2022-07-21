var ERC721MintableComplete = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];

  const BASE_TOKEN_URI =
    "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

  const NUMBER_OF_TEST_TOKENS = 5;
  const TOKEN_NAME = "Enigma Token";
  const TOKEN_SYMBOL = "ENT";

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      // TODO: mint multiple tokens
      this.contract = await ERC721MintableComplete.new(
        TOKEN_NAME,
        TOKEN_SYMBOL,
        {
          from: account_one,
        }
      );
      try {
        for (let tokenId = 0; tokenId < NUMBER_OF_TEST_TOKENS; tokenId++) {
          await this.contract.mint(account_two, tokenId, {
            from: account_one,
          });
        }
      } catch (e) {
        console.log(e);
      }
    });

    it("should return total supply", async function () {
      let amount = await this.contract.totalSupply();

      console.log("amount ", amount);
      assert.equal(
        parseInt(amount),
        NUMBER_OF_TEST_TOKENS,
        "Expected Token Supply is not correct."
      );
    });

    it("should get token balance", async function () {
      let balance = await this.contract.balanceOf(account_two);

      assert.equal(
        parseInt(balance),
        NUMBER_OF_TEST_TOKENS,
        "Expected Token Balance is not correct."
      );
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      const tokenId = 1;
      let tokenURI = await this.contract.tokenURI(tokenId);
      let expectedTokenURI = BASE_TOKEN_URI + tokenId;
      assert.equal(
        tokenURI,
        expectedTokenURI,
        "Expected Token URI is not correct."
      );
    });

    it("should transfer token from one owner to another", async function () {
      const tokenId = 1;

      try {
        await this.contract.transferFrom(account_two, account_three, tokenId, {
          from: account_two,
        });

        let balance = await this.contract.balanceOf(account_two);

        assert.equal(
          parseInt(balance),
          NUMBER_OF_TEST_TOKENS - 1,
          "Expected Token Balance is not correct."
        );
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new(
        TOKEN_NAME,
        TOKEN_SYMBOL,
        {
          from: account_one,
        }
      );
    });

    it("should fail when minting when address is not contract owner", async function () {
      let tokenId = 1;
      let error = false;
      try {
        await this.contract.mint(account_two, tokenId, {
          from: account_two,
        });
      } catch (e) {
        error = true;
      }

      assert.equal(error, true, "Expected error when minting.");
    });

    it("should return contract owner", async function () {
      let owner = await this.contract.getOwner();
      assert.equal(owner, account_one, "Expected Owner is not correct.");
    });
  });
});
