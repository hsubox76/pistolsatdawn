This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Pistols at Dawn (Working Title)

A website that lets you argue on the internet with an opponent of your choice and get validation from observers about which one of you is smarter and better.

## TODO
- ability to invite an opponent
- login/account creation path for an opponent coming to the page from an invitation link
- notification of outstanding invitations (navbar badge + homepage box)
- config page/mode on duel page (tab?)
  - automatically start there after creating a new duel
  - main duel page is locked/disabled until minimum amount of info is filled out (choose an opponent, choose categories)
- set up categories - put the list of them on firebase so people can't invent new ones
- set up display of category scores - total on top and individual in each argument
- security (firebase db rules) - people can only post to their own accounts, arguments, etc
- delete arguments? (only if your opponent hasn't started yet?)