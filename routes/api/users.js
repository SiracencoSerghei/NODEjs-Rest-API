const express = require("express")
const { validateBody, authenticate, filesUploader, checkFilesExtension } = require('../../middlewares')
const { signUserSchema, updateSubscriptionSchema, mailSchema } = require('../../models/joiSchemas')
const ctrl = require('../../controllers/users')
const router = express.Router()
// const api = require('../../elasticEmailer')

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
// update avatar
router.patch(
    "/avatars",
    authenticate,
    filesUploader.single("avatar"),
    checkFilesExtension,
    ctrl.updateAvatar
)


router.get("/verify/:verificationToken", ctrl.verifyMail);

router.post("/verify", validateBody(mailSchema), ctrl.resendVerifyMail);


// router.post('/verify', async (req, res, next) => {
//   try {
//     // Call the emailPost() function from elasticEmailer.js
//     await api.emailPost();
//     res.status(200).json({ message: 'Email sent successfully' });
//   } catch (error) {
//     next(error);
//   }
// });


module.exports = router;
