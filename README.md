# GBG-File

###Install
```
npm i
```

###Start server
```
npm start
```

###Details
Download files are if the folder ```./files```  
Requests' bodies are logged in ```./requests.log```  
Main file clearly commented : ```./server.js```

###Config
Change server ```hostname``` and ```port``` directly in ```server.js```  

###Call
Exemple
```
http://localhost:1337/activation
{
    "hostname": "failed",
    "cpu": "CPU-1234567890",
    "sdcard": "SDCARD-1234567890"
}
```
