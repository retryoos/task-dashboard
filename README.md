# Aegis Defense Systems: Task Management Dashboard

A responsive task management web app for a fictional defense contractor, built
for ITC 4214 Internet Programming. It is a static site (HTML, CSS, JavaScript,
jQuery and Bootstrap 5) with no backend. Tasks are saved in the browser with
localStorage.

- Live site: (add the GitHub Pages link here after publishing)
- Repository: (add the GitHub repository link here)

## Built with

- HTML5 and semantic markup
- Custom CSS with design tokens (one light theme)
- Vanilla JavaScript and jQuery for the DOM work
- Bootstrap 5 (via CDN) for layout and components

## Pages

- `index.html` Home: intro, what the tool does, latest activity feed, live HQ weather.
- `tasks.html` Task board: add form, table, edit/delete/complete, summary, filter, sort, analytics.
- `about.html` About: team grid cards and a testimonial carousel.
- `contact.html` Contact: validated form with a confirmation popup, a map and social links.
- `capabilities.html` Capabilities: division tabs, an FAQ accordion and a resource list.

## How to run

Open `index.html` in a browser, or serve the folder with a static server (for
example the VS Code Live Server extension). Task data is stored per browser, so
adding tasks on one machine does not affect another.

## The task allocation system

A task is a plain JavaScript object:

    { id, name, desc, due, priority, status }

The whole board works on one array of these objects:

- Adding a task pushes a new object with a unique id (the current timestamp) and
  a status of "Pending".
- Editing fills the form with the task's values and updates that object instead
  of adding a new one.
- Deleting removes it from the array.
- Marking complete flips the status between "Pending" and "Completed".

After every change the array is saved to localStorage, so the board survives a
refresh. The table always shows a filtered and sorted view of the array, while
the array itself stays complete.

## Coding decisions

### Tasks page

All the task logic is in `js/tasks.js`, split into small named functions:
`refresh` redraws everything, `getVisibleTasks` returns a filtered and sorted
copy, `renderRows` builds the table rows, `updateSummary` sets the three counts,
and `updateChart` sets the bar widths. The buttons on each row use event
delegation, `$("#taskTableBody").on("click", ".btn-delete", ...)`, so they keep
working on rows that are created after the page loads.

### Latest activity

Every add, edit, delete and complete calls `logActivity`, which stores a short
line and a timestamp in a second localStorage list (capped at 20). The home page
reads that list in `js/home.js` and shows the latest few, so the two pages stay
in sync without a server.

### Capabilities page (my chosen page)

This page shows three Bootstrap components that are not used anywhere else: pill
tabs for the divisions, an accordion for the FAQ, and a list group for
resources. They all run on Bootstrap's data attributes, so the page needs no
extra JavaScript of its own.

### Shared header and footer

The navbar and footer are the same on every page, so they are built once in
`js/main.js` and injected into a placeholder element. That avoids repeating the
markup five times and means the menu only changes in one place.

## Accessibility, SEO and performance

(Run Chrome Lighthouse on the published site and paste the scores and
screenshots here.)

What I did for the audit:

- Every page has a `lang` attribute, a unique title and a meta description.
- Forms use `<label>` elements tied to their inputs.
- Decorative icons use `aria-hidden`; icon links use `aria-label`.
- The active menu link is marked with `aria-current="page"`.
- The colour palette was chosen for readable contrast.

## Reflections

(Add your own reflection here. Prompts: what was hardest, how you fixed it, what
you would add next.)

The trickiest part was keeping the task array as the single source of truth while
still showing a filtered and sorted view. The fix was to never change the main
array during filtering: `getVisibleTasks` returns a copy, so the filters never
lose data. Wiring up the row buttons was also confusing until I switched to event
delegation, because the rows are created dynamically.
