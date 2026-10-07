# Šapica

Statički sajt o kučićima na srpskom. Lokalne SVG ilustracije, pretraga, favoriti, dnevna lista, ideje za aktivnosti i dva posebna vodiča. Favoriti i lista ostaju u lokalnoj memoriji browsera; nema naloga ni slanja tih podataka na server.

## Lokalno

```sh
node scripts/build.mjs
python3 -m http.server 8080 --directory dist
```

`amplify.yml` gradi i objavljuje samo `dist`. README i build skripta nisu u javnim fajlovima. Isti izlaz može da se objavi i Shipvela CLI-jem. GitHub push auto-deploy zahteva instaliranu Shipvela Deploy aplikaciju i uključenu opciju na projektu.

Demo release: sapica-20261007-v2.
