# Module 2 Group Assignment

CSCI 5117, Fall 2025

[Assignment Description](https://canvas.umn.edu/courses/518559/pages/project-2)

## App Info

- Team Name: The Hot Takers
- App Name: ForeverNote
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
https://www.canva.com/design/DAG4aRBi1ik/SJLDngZ8nj8_Kzjo0kR3QQ/view?utm_content=DAG4aRBi1ik&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hc19a2427f4

## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

- If the Practice Exam Generator fails during testing, it might be primarily due to hitting Gemini API's maximum quota. We have our Google Project linked to a billing account, however, can't guarantee yet that Gemini will reliably use this billing account since we haven't encountered any issues as such during our testing. We are including screenshots of the practice exam pages as well.
- The TinyMCE editor remains white in Dark Mode - We've tried to modify the color of the editor on dark mode, to no avail.
- Our audio transcription in the notes section does not work on Firefox due to API integration difficulties
  
## Screenshots of Site (complete)

**[Add a screenshot of each key page](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
along with a very brief caption:**

<img width="1470" height="841" alt="image" src="https://github.com/user-attachments/assets/4f595535-88a0-4f8b-8b26-3d38a3ef04c8" />
Splash page
<img width="1470" height="839" alt="image" src="https://github.com/user-attachments/assets/cc9748c4-7058-45f7-af41-38997111baa5" />
Profile page
<img width="1469" height="839" alt="image" src="https://github.com/user-attachments/assets/617bfe92-a927-427d-90d2-4c0a4ea72355" />
Dashboard
<img width="1470" height="839" alt="image" src="https://github.com/user-attachments/assets/ee7f0a26-61dc-4739-b315-2e28fe594369" />
Create new exam modal
<img width="1470" height="839" alt="image" src="https://github.com/user-attachments/assets/0a7905aa-0da5-496e-a01a-9966c703af6f" />
Notes page
<img width="1470" height="838" alt="image" src="https://github.com/user-attachments/assets/72e8683a-b6e0-45ad-a2ae-225a4997b075" />
Notes Editor page
<img width="1470" height="840" alt="image" src="https://github.com/user-attachments/assets/45c1a092-c0dc-4ea5-8b50-7c5b574ed33b" />
Exam Generator page
<img width="1470" height="836" alt="image" src="https://github.com/user-attachments/assets/e4da181e-4285-4efe-b63d-954275c320eb" />
404 page


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

- Our Exam Generator functionality relies on Firebase functions that are deployed using Firebase Functions. The code - sanitized of any API secrets - can be found here: https://github.com/yaseenshakil/Gemini-Firebase-Function

...
