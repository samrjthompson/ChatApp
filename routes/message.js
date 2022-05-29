const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const { userSchema } = require('../schemas')