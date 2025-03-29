# Testing about Route Finding

The `get_route` API takes 2 points from the frontend and then returns a `json` to the frontend.

```
{
	start: {lon: ??? , lat: ???},
	dest: {lon: ??? , lat: ???}
}
```



You may test if the API works in the browser console:

**Success: You will see a `json` printed from the console**

```javascript
fetch('http://127.0.0.1:5000/api/get_route', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    start: { lon: -88.228929, lat: 40.112724 },
    dest: { lon: -88.236064, lat: 40.101462 }
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```



You may use different cases (such as one or more point missing or invalid coordinates). 

**Error: One point missing**

```javascript
fetch('http://127.0.0.1:5000/api/get_route', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    start: { lon: -88.228929, lat: 40.112724 },
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

**Error: Invalid coordinates**

```javascript
fetch('http://127.0.0.1:5000/api/get_route', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    start: { lon: 888.888888, lat: 777.777777 },
    dest: { lon: 666.666666, lat: 555.555555 },
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```