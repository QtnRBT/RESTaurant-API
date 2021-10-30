# Getting started with RESTaurant API

This page will help you get started with RESTaurant API. I'm sure you'll rock it !

## Installation

Create a folder wherever you want on your PC and open a terminal.
Then change directory in your terminal such as below :

```bash
cd WHEREVER/YOU/MADE/A/DIRECTORY
```

Then we will need to clone this repository to start the API.

```bash
git clone git@github.com:EpitechDigitalPromo2026/D-API-100-D-API-100_Bordeaux_quentin-robert.git
```

Then, it will download all the code in the folder `D-API-100-D-API-100_Bordeaux_quentin-robert`.

Before starting the api, we need to make sure we have all the required modules downloaded, as they are not included in the repository.

To do this, you first need to head into the main folder which is `/D-API-100-D-API-100_Bordeaux_quentin-robert`.

```bash
cd D-API-100-D-API-100_Bordeaux_quentin-robert
```

We will use NPM to install all of the modules.

```bash
npm install
```

Once we have all of the packages installed, we can start the API by typing ```nodemon .```

## GET Requests

You have three different types of data you can retrieve from our API which are :

1. **Items** (which are dishes)
2. **Categories** (which are categories of dishes such as Starters and Desserts)
3. **Formulas** (which are groups of categories)

### Items
If you want to get **all** the existing dishes there are in our database, you can use a **get** request on the `http://localhost:3000/items` route which would return this data.

```json
{
    "items": [
        {
            "name": "Brownie au chocolat",
            "price": 5.4,
            "description": "Une bonne part de gâteau au chocolat pour vous remonter le moral.",
            "category_id": 5,
            "id": 4
        },
        {
            "name": "Tartiflette",
            "price": 10.5,
            "description": "Un bon plat de savoie pour se remplir la panse.",
            "category_id": 4,
            "id": 5
        }
    ]
}
```

Alternatively, you might want to request only one dish. To do so, you can either get one by it's id, or other parameters.

Let's imagine you only want to get the **Tartiflette**. 

First case scenario when you know it's id, you will have to make a get request on the `http://localhost:3000/items/5` where 5 is the id of the dish you want to get. It will return this data :

```json
{
    "name": "Tartiflette",
    "price": 10.5,
    "description": "Un bon plat de savoie pour se remplir la panse.",
    "category_id": 4,
    "id": 5
}
```

If the item you're trying to request doesn't exist, it will return this data :

```json
{
    "code": 404,
    "message": "This item doesn't exist."
}
```

You can also get a dish from different parameters, for instance you can get a dish from it's price. Let's try to get the Brownie for example. So we're gonna make a get request on the `http://localhost:3000/items?price=5.4`.

```json
{
    "name": "Brownie au chocolat",
    "price": 5.4,
    "description": "Une bonne part de gâteau au chocolat pour vous remonter le moral.",
    "category_id": 5,
    "id": 4
}
```

In the case where no value is found, it will return this data :

```json
{
    "code": 404,
    "message": "No item found with the given parameters."
}
```