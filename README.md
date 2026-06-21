# Task Dashboard

The following project is my midterm project for ITC 4214 - Internet Programming by Dr. Mageiros. I built a small task manager for a defense company called Argus Defense Systems. The user has the ability to add a task, give it a due date and a priority, and the page keeps track of what is done and what is still pending.

Everything is built on HTML, CSS, JavaScript with jQuery, and Bootstrap 5, as per the instructions there is no
backend, so the tasks are kept in the browser with localStorage.

- Live page: https://retryoos.github.io/task-dashboard/
- Code: https://github.com/retryoos/task-dashboard

## Pages

- `index.html` - home page: a short intro, the latest activity list, and live weather for the HQ city.
- `tasks.html` - the task board: the add form, the table, edit / delete / complete, the totals, filtering, sorting, and small analytics bars.
- `about.html` - about the project, the team cards, and a testimonial carousel.
- `contact.html` - a contact form with validation, a confirmation popup, a Google map, and social links.
- `capabilities.html` - my extra page, with tabs, an FAQ accordion, and a resource list.

## Running it

Open `index.html` in a browser. To be safe with the relative paths I run it through a
small static server (the Live Server extension in VS Code). Tasks are saved per
browser, so what you add on one machine will not show up on another.

## How the task list works

Each task is a small object:

    { id, name, desc, due, priority, status }

The page keeps one array of these, adding pushes a new object, editing changes the
one with the matching id, deleting filters it out, and the complete button flips the
status between Pending and Completed. After any change the array is saved to
localStorage, so a refresh does not lose anything. The table shows a filtered and
sorted copy of the array, while the array itself stays whole.

## Some choices I made

- The navbar and footer are built once in `main.js` and dropped into every page, so I
  am not pasting the same HTML into five files.
- The row buttons use jQuery's `.on()` with a class selector, so they keep working on
  rows that are added after the page loads. This caught me out at first.
- The latest activity on the home page reads from a second small list in localStorage
  that the task page writes to whenever something changes.
- The analytics are just `div` bars whose width I set as a percentage. A chart library
  felt like overkill for this.

## Accessibility and responsiveness

- Every page has a language attribute, its own title, and a meta description.
- The form inputs have real labels, and the icon links have aria-labels.
- The current menu item is marked with `aria-current`.
- The layout uses the Bootstrap grid, so columns stack on phones and the menu becomes sa hamburger. I checked it at phone, tablet, and desktop widths.

## What was hardest part

I rewrote the filtering a few times, because I kept changing the main task array by accident
while filtering it, which dropped tasks. Once I made the filter return a copy and leave the original alone, it was working as intended. Finally the row buttons were the other tricky bit until I switched to event delegation.
