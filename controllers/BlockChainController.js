"use strict";
var BlockChain = require('../models/BlockChain');
var BlockController = require('./BlockController');
var Block = require("../models/Block");
var parserData = require("../parsers/ParserURLToData"); 

module.exports = class BlockChainController {
	constructor() {
		this.blockChain = new BlockChain();
		this.blockCtr = new BlockController();
		this.blockChain.blocks.push(this.blockCtr.genesisBlock());
	}

	addNewBlock(blockDataRaw) {
		var blockData = parserData.paramsToData(blockDataRaw);

		if (blockData) {
			var newBlock = this.generateNextBlock(blockData)
			this.blockChain.blocks.push(newBlock);
			return { status: true, new_block: newBlock };
		}

		return { status: false, new_block: null };
	}

	getAllBlocks() {
		return this.blockChain.blocks;
	}

	getLastestBlock() {
		return this.blockChain.blocks[this.blockChain.blocks.length - 1];
	}

	generateNextBlock(nextBlockData) {
		var previousBlock = this.getLastestBlock();

		var nextIndex = previousBlock.index + 1;
		var nextTimeStamp = this.blockCtr.getTimeNow();
		var newHash = this.blockCtr.calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, nextBlockData);
		var newBlock = new Block(nextIndex, newHash, previousBlock.hash, nextTimeStamp, nextBlockData);

		return newBlock;
	}

	isValidNewBlock(newBlock, lastestBlock) {
		if (lastestBlock.index - 1 !== newBlock.index) {
			console.error('invalid index');
			return false;
		} else if (lastestBlock.hash !== newBlock.previousHash) {
			console.error('invalid hash');
			return false
		} else if (this.calculateHashForBlock(newBlock) !== newBlock.hash) {
			console.error('invalid hash : typeOf hash #');
			return false;
		}

		return true;
	}
}