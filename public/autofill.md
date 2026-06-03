# Autofill bookmarklet (the legitimate, review-then-submit kind)

This does NOT auto-submit anything. It fills visible form fields it can
confidently match (name, email, phone) from your profile, then leaves you
to review and click submit yourself.

## Install
1. Run the app (`npm run dev`) so `http://localhost:3000/api/profile` works.
2. Create a new browser bookmark.
3. Paste the code from `autofill-bookmarklet.js` (everything on the one line)
   into the bookmark's URL/address field.
4. On any job application page, click the bookmark.

> Note: it reads from localhost, so it works while the app runs on your
> machine. For use on the open web you'd host the profile endpoint or
> hard-code your values into the bookmarklet.
