# Project Refactoring and New Plan

The project has undergone a major refactoring, resulting in a new project structure and the removal of legacy files. The `campus-360-app` is now the main application, built with React.

The `todo.md` file has been reset to reflect the new plan, and all tasks from the original "Production-Ready Updates" are now pending. This `UPDATES.md` file will be maintained to track the progress of the project.

# Production-Ready Updates for Campus Virtual Tour

This document outlines the necessary updates to make the Campus Virtual Tour project production-ready.

## 1. UI/UX Improvements

The current UI is functional but lacks the polish and professionalism expected of a production-level application. The following improvements are recommended:

- **Redesign the color palette and typography:** Choose a modern and accessible color scheme that aligns with the institution's branding. Select a clean and readable font for all text elements.
- **Improve the layout and spacing:** The current layout feels a bit cluttered. Improve the spacing and alignment of UI elements to create a more visually appealing and easy-to-navigate interface.
- **Enhance the look and feel of UI components:**
    - **Buttons:** Redesign the buttons to be more prominent and visually engaging. Add hover and active states to provide better feedback to the user.
    - **Navbar:** Create a more professional-looking navbar with a clear and intuitive navigation structure.
    - **Menus and Modals:** Improve the design of menus and modals to make them more user-friendly and visually appealing.
- **Add a custom logo:** Replace the current logo placeholder with the institution's official logo.
- **Implement a loading screen:** Instead of a simple loader, create a more engaging loading screen that displays the tour's progress.

## 2. Functionality Fixes and Enhancements

- **Fix broken buttons:** The buttons in the application are currently not working. Identify the cause of the issue and implement a fix.
- **Implement autoplay:** The autoplay feature is not working. Implement a robust autoplay mechanism that smoothly transitions between scenes after a period of inactivity.
- **Add a "Help" or "Info" section:** Provide users with instructions on how to navigate the tour and interact with the different elements.
- **Implement a search functionality:** Allow users to search for specific locations or points of interest within the tour.
- **Add social sharing buttons:** Allow users to share their virtual tour experience on social media.

## 3. Code Quality and Refactoring

- **Improve code organization:** Refactor the code to improve its structure and organization. Group related components and functions into separate modules.
- **Add comments and documentation:** Add comments to the code to explain complex logic and improve readability. Create a comprehensive documentation for the project.
- **Implement a linter and formatter:** Use a linter and formatter (like ESLint and Prettier) to enforce a consistent code style and catch potential errors.
- **Refactor the state management:** The current state management is good, but it could be improved by using more specific and granular state slices.

## 4. Performance Optimizations

- **Optimize the 3D assets:** The 3D models and textures can have a significant impact on performance. Optimize the assets to reduce their file size and improve loading times. (Note: Assets are located in `public/exported/` and `assets/entrances/`. Manual optimization using external tools like image compressors or 3D model optimizers is recommended.)
- **Implement lazy loading:** Load 3D assets and other resources on demand to reduce the initial loading time.
- **Use a CDN:** Serve the application's assets from a Content Delivery Network (CDN) to improve loading times for users around the world. (Note: Implementing a CDN is a deployment-level configuration and requires external setup with a hosting provider or a dedicated CDN service.)

## 5. Accessibility

- **Ensure keyboard navigation:** Make sure that all interactive elements can be accessed and operated using the keyboard.
- **Add ARIA attributes:** Add ARIA attributes to UI elements to improve their accessibility for screen readers.
- **Provide alternative text for images:** Provide descriptive alternative text for all images in the application. (Note: Current UI components primarily use SVG icons, which do not require `alt` text. Developers should ensure `alt` attributes are added to any new `<img>` elements introduced, especially for the custom logo or other informational images.)

## 6. Testing

- **Implement a testing strategy:** Create a comprehensive testing strategy that includes unit tests, integration tests, and end-to-end tests.
- **Write unit tests for components and functions:** Write unit tests for all components and functions to ensure that they are working as expected.
- **Write integration tests for the application's features:** Write integration tests for the application's features to ensure that they are working together correctly. (Recommendation: Use React Testing Library to simulate user interactions and verify component collaborations. Focus on key feature flows rather than isolated components.)
- **Write end-to-end tests for the user flows:** Write end-to-end tests for the user flows to ensure that the application is working as expected from the user's perspective. (Recommendation: Utilize dedicated E2E testing frameworks like Cypress or Playwright to simulate full user journeys through the application.)

## 7. Deployment

- **Set up a CI/CD pipeline:** Set up a Continuous Integration/Continuous Deployment (CI/CD) pipeline to automate the build, testing, and deployment process. (Recommendation: Consider platforms like GitHub Actions, GitLab CI/CD, or Jenkins for automation.)
- **Choose a hosting provider:** Choose a reliable hosting provider that can handle the application's traffic and provide a good user experience. (Recommendation: Options include cloud providers like AWS, Azure, Google Cloud, or specialized platforms like Vercel or Netlify for static site hosting.)
- **Monitor the application:** Monitor the application for errors and performance issues to ensure that it is running smoothly. (Recommendation: Integrate monitoring tools such as Sentry for error tracking, New Relic or Datadog for performance monitoring, and Prometheus/Grafana for infrastructure metrics.)
