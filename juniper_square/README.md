# Juniper Square Interview Kit

This README will walk you through the setup and use of the Juniper Square Interview Kit, which you've successfully received and unzipped if you're reading this message.

This is the interview kit for *Front End* candidates. If you've received this interview kit in error, please let your interviewer know and we'll provide you with the correct kit.

This exercise is *not designed to be completed*; the goal isn't to finish the entire implementation, but rather provide a large surface area where you can focus on aspects you feel best showcase the skills you'd like to show us. Best practices matter! Aim to submit a solution which would pass your own code review.

## Getting Started

You will need to have Docker installed. Download here:
https://www.docker.com/products/docker-desktop

There are two containers used in this exercise: the API Documentation and the Reference API.

Run this command from the same directory containing this README file:
```
$ docker-compose up
```

After the services are running, you should be able to view the OpenAPI documentation at http://localhost:8080. The API server is available at http://localhost:8081.

## The Goal

Implement a "contact book" UI for the provided API. Consult the documentation to learn about the reference API provided for you. You may use any tools, libraries, or frameworks you would ordinarily have available, including application generators and bootstrap repositories.

Your solution will *not* be graded on implementing a complete solution, which would exceed the 90 minutes allotted for this exercise. Instead, we'd like you to focus on the way the UI is built, and deliver the best possible solution you can for the _subset_ of UI functionality you choose to implement.

Some features you may want to implement:

A contacts page that lists all contacts

Create a new contact

View contact details
  - name and email
  - tags
  - list of notes
  
Edit an existing contact
  - update name and email
  - add and remove tags
  - add, edit, and remove notes
  
