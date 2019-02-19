# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.

```
GET 911/call/_search
{
    "size": 0,
    "query": {
        "bool" : {
            "must" : {
                "match_all" : {}
            },
            "filter" : {
                "geo_distance" : {
                    "distance" : "500m",
                    "coordinates" : {
                        "lon" : -75.283783,
                        "lat" :  40.241493
                    }
                }
            }
        }
    }
}
———————————————————————————
GET 911/_search
{
    "size": 0,
    "aggs" : {
        "call" : {
            "terms" : { "field": "category.keyword" }
        }
    }
}
——————————————————————————————
GET 911/_search
{
  "size" : 0,
  "aggs" : {
    "calls" : {
      "date_histogram" : {
        "field" : "date",
        "interval" : "month",
        "order" : { "_count" : "desc" },
        "format" : "yyyy-MM"
      }
    }
  }
}
———————————————————————————
GET 911/call/_search
{
  "size" : 0,
    "query" : {
      "term" : {
        "detail.keyword": "OVERDOSE"
      } 
    },
    "aggs": {
      "overdoses" : {
            "terms": {
                "field": "twp.keyword",
                "order": {
                    "_count" : "desc" 
                },
                "size": 3
            }
        }
    }
}
```

## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

Pour nous permettre d'évaluer votre travail, ajoutez une capture d'écran du dashboard dans ce répertoire [images](images).

### Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```
