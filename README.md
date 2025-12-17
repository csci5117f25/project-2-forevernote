# Module 2 Group Assignment

CSCI 5117, Fall 2025

[Assignment Description](https://canvas.umn.edu/courses/518559/pages/project-2)

## App Info

- Team Name: The Hot Takers
- App Name: For-Evernote
- App Link: <https://forevernote-6244a.web.app>
- App Link (Alternate): <https://forevernote-6244a.firebaseapp.com>

### Students

- William Lin, <lin00682@umn.edu>
- Yaseen Shakil, <shaki024@umn.edu>
- Joshua Cheng, <chen7647@umn.edu>
- Tim Lu, <luxx0586@umn.edu>

## Key Features

**Describe the most challenging features you implemented (one sentence per bullet, maximum 4 bullets);**

- Utilizing Gemini AI to implement practice exam generation
- Used TinyMCE to add a multi-featured text editor
- Using Web Speech API and/or a locally-hosted model to perform speech-to-text transcription

Which (if any) device integration(s) does your app support?

- Using the device microphone to perform speech-to-text transcription

Which (if any) progressive web app feature(s) does your app support?

- None

## Mockup images

Our mockup is located at this link:
[Canva Mockup](https://www.canva.com/design/DAG4aRBi1ik/_6ksbP7Fwn0vtPdezELpkg/edit?utm_content=DAG4aRBi1ik&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

- If the Practice Exam Generator fails during testing, it might be primarily due to hitting Gemini API's maximum quota. We have our Google Project linked to a billing account, however, can't guarantee yet that Gemini will reliably use this billing account since we haven't encountered any issues as such during our testing. We are including screenshots of the practice exam pages as well.
- The TinyMCE editor remains white in Dark Mode - We've tried to modify the color of the editor on dark mode, to no avail.

## Screenshots of Site (complete)

**[Add a screenshot of each key page](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
along with a very brief caption:**

![Cat Slapping Keyboard](https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif)

## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., VUE, Firebase, vuefire).**

- Google Gemini
- Hugging Face/Xenova Transformers for Audio Transcription
- TinyMCE for Rich Text Editor
- Bulma for CSS Styling

**If there's anything else you would like to disclose about how your project
relied on external code, expertise, or anything else, please disclose that
here:**

- Our Exam Generator functionality relies on Firebase functions that are deployed using Firebase Functions. The code - sanitized of any API secrets - can be found here:

...
