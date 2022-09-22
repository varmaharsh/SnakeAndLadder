const { expect } = require("chai");

const { ethers } = require("hardhat");

describe("Snake and Ladder game", function () {
  it("check if snakes array is loaded", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    const snakes = await snakeAndLadder.getAllSnakes();

    expect(snakes.length).to.equal(10);

    expect(snakes[0].start).to.equal(16);
    expect(snakes[0].end).to.equal(6);
  });

  it("check if ladders array is loaded", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    const ladders = await snakeAndLadder.getAllLadders();

    expect(ladders.length).to.equal(11);

    expect(ladders[0].start).to.equal(2);
    expect(ladders[0].end).to.equal(38);
  });

  it("Check if game has not started", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    const gameStarted = await snakeAndLadder.isGameStarted();
    expect(gameStarted).to.equal(false);

    const gameEnded = await snakeAndLadder.isGameEnded();
    expect(gameEnded).to.equal(false);

    const totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(0);
  });

  it("Add one player and start the game", async function () {
    // Add a Promise, and check event is emitted
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    await snakeAndLadder.addPlayer(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );

    const totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(1);

    const playerId = await snakeAndLadder.getPlayerId(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );
    expect(playerId).to.equal(1);

    const playerPosition = await snakeAndLadder.getPlayerPosition(playerId);
    expect(playerPosition).to.equal(0);

    try {
      await snakeAndLadder.startGame();
    } catch (e) {
      expect(e.toString()).to.contains("AddMorePlayers");
    }
  });

  it("Add two repeated players", async function () {
    // Add a Promise, and check event is emitted
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    await snakeAndLadder.addPlayer(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );

    const totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(1);

    const playerId = await snakeAndLadder.getPlayerId(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );
    expect(playerId).to.equal(1);

    const playerPosition = await snakeAndLadder.getPlayerPosition(playerId);
    expect(playerPosition).to.equal(0);

    try {
      await snakeAndLadder.addPlayer(
        "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
      );
    } catch (e) {
      expect(e.toString()).to.contains("PlayerAlreadyExists");
    }
  });

  it("Add two players and start the game", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    await snakeAndLadder.addPlayer(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );

    let totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(1);

    const playerId1 = await snakeAndLadder.getPlayerId(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );
    expect(playerId1).to.equal(1);

    const playerPosition1 = await snakeAndLadder.getPlayerPosition(playerId1);
    expect(playerPosition1).to.equal(0);

    await snakeAndLadder.addPlayer(
      "0xdD870fA1b7C4700F2BD7f44238821C26f7392148"
    );

    totalPlayers = await snakeAndLadder.getTotalPlayers();
    expect(totalPlayers).to.equal(2);

    const playerId2 = await snakeAndLadder.getPlayerId(
      "0xdD870fA1b7C4700F2BD7f44238821C26f7392148"
    );
    expect(playerId2).to.equal(2);

    const playerPosition2 = await snakeAndLadder.getPlayerPosition(playerId2);
    expect(playerPosition2).to.equal(0);

    await snakeAndLadder.startGame();

    const gameStarted = await snakeAndLadder.isGameStarted();
    expect(gameStarted).to.equal(true);

    const chanceId = await snakeAndLadder.getChance();
    expect(chanceId).to.equal(1);
  });

  it("Can't add more than 4 players", async function () {
    const snakeAndLadderContract = await ethers.getContractFactory(
      "SnakeAndLadder"
    );
    const snakeAndLadder = await snakeAndLadderContract.deploy();
    await snakeAndLadder.deployed();

    await snakeAndLadder.addPlayer(
      "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
    );
    await snakeAndLadder.addPlayer(
      "0xdD870fA1b7C4700F2BD7f44238821C26f7392148"
    );
    await snakeAndLadder.addPlayer(
      "0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC"
    );
    await snakeAndLadder.addPlayer(
      "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c"
    );
    try {
      await snakeAndLadder.addPlayer(
        "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB"
      );
    } catch (e) {
      expect(e.toString()).to.includes("CannotAddMorePlayers");
    }
  });

  describe("Game starts", async function () {
    let snakeAndLadder;
    beforeEach(async function () {
      const snakeAndLadderContract = await ethers.getContractFactory(
        "SnakeAndLadder"
      );
      snakeAndLadder = await snakeAndLadderContract.deploy();
      await snakeAndLadder.deployed();
      await snakeAndLadder.addPlayer(
        "0x8ecca9951e02aa8dc7c01150e96c990bbbcb71f1"
      );
      await snakeAndLadder.addPlayer(
        "0xdD870fA1b7C4700F2BD7f44238821C26f7392148"
      );
      await snakeAndLadder.addPlayer(
        "0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC"
      );
      await snakeAndLadder.addPlayer(
        "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c"
      );
      await snakeAndLadder.startGame();
    });
    it("only player with his chance can make a move", async function () {
      try {
        await snakeAndLadder.makeMove(2, 3);
      } catch (e) {
        expect(e.toString()).to.includes("NotYourChance");
      }
    });
    it("make a valid dice move", async function () {
      try {
        await snakeAndLadder.makeMove(1, 0);
      } catch (e) {
        expect(e.toString()).to.includes("InvalidNumberOnDice");
      }
      try {
        await snakeAndLadder.makeMove(1, 7);
      } catch (e) {
        expect(e.toString()).to.includes("InvalidNumberOnDice");
      }
    });
    it("player with 6 gets another chance", async function () {
      let chanceId = await snakeAndLadder.getChance();
      await snakeAndLadder.makeMove(chanceId, 6);
      chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(1);
    });
    it("chance transferred correctly", async function () {
      await snakeAndLadder.makeMove(1, 2);
      let chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(2);
      await snakeAndLadder.makeMove(2, 2);
      chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(3);
    });
    it("start with 6 only", async function () {
      let chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(1);
      await snakeAndLadder.makeMove(chanceId, 3);
      chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(2);
      const playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(0);
    });

    it("climbs ladder at 2 to climb to 38", async function () {
      let chanceId = await snakeAndLadder.getChance();
      await snakeAndLadder.makeMove(chanceId, 6);
      await snakeAndLadder.makeMove(chanceId, 1);
      const playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(38);
      chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(1);
    });
    it("climbs ladder at 7 then snake at 16", async function () {
      let chanceId = await snakeAndLadder.getChance();
      await snakeAndLadder.makeMove(chanceId, 6);
      await snakeAndLadder.makeMove(chanceId, 6);
      let playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(14);
      chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(1);
      await snakeAndLadder.makeMove(chanceId, 2);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(6);
      chanceId = await snakeAndLadder.getChance();
      expect(chanceId).to.equal(2);
    });

    it("make player 1 complete the game in one chance", async function () {
      let chanceId = await snakeAndLadder.getChance();
      await snakeAndLadder.makeMove(chanceId, 6);
      await snakeAndLadder.makeMove(chanceId, 6);
      let playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(14);
      await snakeAndLadder.makeMove(chanceId, 6);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(20);
      await snakeAndLadder.makeMove(chanceId, 1);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(42);
      await snakeAndLadder.makeMove(chanceId, 6);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(48);
      await snakeAndLadder.makeMove(chanceId, 3);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(67);
      await snakeAndLadder.makeMove(chanceId, 4);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(91);
      await snakeAndLadder.makeMove(chanceId, 6);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(97);
      await snakeAndLadder.makeMove(chanceId, 3);
      playerPosition = await snakeAndLadder.getPlayerPosition(1);
      expect(playerPosition).to.equal(100);

      try {
        await snakeAndLadder.makeMove(chanceId, 1);
      } catch (e) {
        expect(e.toString()).to.includes("GameHasAlreadyEnded");
      }
      const gameEnded = await snakeAndLadder.isGameEnded();
      expect(gameEnded).to.equal(true);

      const winner = await snakeAndLadder.getWinner();
      expect(winner).to.equal(chanceId);
    });
  });
});
