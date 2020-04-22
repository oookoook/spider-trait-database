# Automatic taxonomy updates

This script updates the taxonomy database with the newest data from the [https://wsc.nmbe.ch/dataresources](WSC).

The scripts expect a full database snapshot available in the database (inserted using SQL - instructions below) and then queires the WSC API for changes since the last update.

To setup automatic updates, run these commands (your pwd must be this directory):

```sh
cp lastrun.template lastrun

# If you have newer snapshot than provided in the repo, change the timestamp in the lastrun to match the date of your snapsot

ln -s ./run /etc/cron.weekly/spider-traits-taxonomy-update
```

## Using sql-gen utility

The sql-gen utility generates SQL commands to populate the database with a current snapshot of the WSC database. To run the utility, you need two files from the WSC in the same structure as files in the `initial-data` folder.

Then run the script:

```sh
node sql-gen './initial-data/WSC_species_val_nd_nn_20200420.csv' './initial-data/WSC_species_syn_homrep_20200420.csv' > ./taxonomy.sql
```

Then you can import the data into the database using the prepared SQL script.

Next, prepare the timestamp to set the lastrun to so the automatic updates can request changes since the day the snapshot was created. In Chrome Dev Tools, enter the following code int the console (change the date):

```javascript
new Date('2020-04-20T12:00:00.000Z').valueOf()
```

Copy the resulting value (e.g. `1587384000000`) and modify the lastrun file:

```sh
echo "1587384000000" > lastrun
```
