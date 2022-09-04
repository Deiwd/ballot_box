# Bullet Box Online

<p>Website created exclusively to practice Javascript</p>


## General

It's an application that simulates an Electronic Voting System, and in it is possible to choose the desired candidate by typing his number, just below there is a list of profiles with photo, name, party name and number. Data is obtained through an API request

### <a href="https://deiwd.github.io/ballot_box/" align="center">view website</a>

<img src="media/ballot_box.gif?raw=true" width="800px" height="auto" align="center" />

## API

```swift
[
    {
        "title": "City Councilor",
        "digits": 5,
        "candidates": [
            {
                "number": "38111",
                "name": "Elegant Elephant",
                "party": "SCH",
                "pictures": [
                    {"url": "38111.jpg", "subtitle": "City Councilor", "small": false}
                ]
            }
        ]
    },
    {
        "title": "Mayor",
        "digits": 2,
        "candidates": [
            {
                "number": "21",
                "name": "Mr. Bunny",
                "party": "BOOK",
                "pictures": [
                    {"url": "21.jpg", "subtitle": "Mayor"},
                    {"url": "21_2.jpg", "subtitle": "Vice Mayor", "small": true}
                ]
            }
        ]
    }
]
```
