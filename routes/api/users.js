const express = require("express")
const { validateBody, authenticate } = require('../../middlewares')
const { signUserSchema, updateSubscriptionSchema } = require('../../models/joiSchemas')
const ctrl = require('../../controllers/users')
const router = express.Router()

// sign up
router.post("/register", validateBody(signUserSchema), ctrl.register)
// sign in
router.post("/login", validateBody(signUserSchema), ctrl.login)
// log out
router.post("/logout", authenticate, ctrl.logout);
// current user
router.get("/current", authenticate, ctrl.getCurrent);
// Subscription renewal
router.patch("/", authenticate, validateBody(updateSubscriptionSchema), ctrl.renewalSubscription)




module.exports = router;