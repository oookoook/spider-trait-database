# DB Notes and instructions

## Installation

> **The MariaDB was updated to a newer version, the following tutorial is not valid**

See following links for upgrade process:
<https://mariadb.com/kb/en/yum/> (adding the repos using the script)
<https://www.tecmint.com/upgrade-mariadb-5-5-to-10-centos-rhel-debian-ubuntu/> (running the update process)

Follow [instructions](https://linuxize.com/post/install-mariadb-on-centos-7/).

```shell
sudo yum install mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo systemctl status mariadb
sudo mysql_secure_installation
```

## Mounting (and formatting) the db storage volume

Read about the [formatting](https://kwilson.io/blog/format-a-linux-disk-as-ext4-from-the-command-line/) and [automounting](https://codingbee.net/rhcsa/rhcsa-mounting-a-partition).

In the fdisk:

* create GPT table
* create one partition

Then, format the partition to XFS.

```shell
sudo fdisk /dev/sdb
mkfs.xfs /dev/sdb1
```

Edit the `/etc/fstab` file according to the instructions above.

## MariaDB configuration changes

Then, edit the `/etc/my.conf.d/server.cnf` to contain (pool size should be 70% of avilable RAM):

```text
[mysqld]
datadir=/mnt/db-storage/db
innodb_buffer_pool_size = 11G
key_buffer_size = 10M
```

## Setting up the database backups

There are prepared scripts for backuping the databse in the `db/backup` directory. Run the `setup` script to configure the backups: paths and credentials. The script adds symlink to `etc/cron.daily` to run the backup periodically. The script creates a full backup every third friday (and deletes all the old backups in the directory). On other days, the backup is only incremental.

You can call the backup manually: `backup` or `backup full` (the later command forces the script to make the full backup, removing all the older backups in the directory).

## Restoring database backups

1. Get all the backups since last full backup (e.g. from Bacula tape drive). In the following example, the folder is called `backup`.
1. Prepare the backup using the procedure described in [MariaDB docs](https://mariadb.com/kb/en/incremental-backup-and-restore-with-mariabackup/) - run the commands from the directory *above* the `backup`

    1. Prepare the full backup: `mariabackup --prepare --target-dir=$(find ./backup -name "*-full")`
    1. Apply all incremental backup files: `find ./backup -name "*-incr" -print0 | sort -z | xargs -r0 -I{} --verbose mariabackup --prepare --target-dir=$(find ./backup -name "*-full") --incremental-dir={}`  

1. Stop the MariaDB process - try `systemctl stop mariadb`
1. Restore the backup: `mariabackup --copy-back --force-non-empty-directories --target-dir=$(find ./backup -name "*-full")`
1. Start the MariaDB process: `systemctl start mariadb`

## Schema model

* The `db-model.mwb` file is created in MySQL Workbench tool and contains the database design.
* The `create-schema.sql` is a script generated from the model. Can be used to create the database.
* The `*-enums.sql` scripts are meant to be executed after the schema is created and populate the database with the basic enumerations.
* Then populate the taxonomy database with the data from the WSC. Refer to the [separate README](../backend/util/taxonomy-synchro/README.md) for instructions.

The creation script creates a default user with credentials `app/app`. Use [a guide](https://linuxize.com/post/how-to-change-mysql-user-password/) to change the password for production environment:

```sql
SET PASSWORD FOR 'app' = PASSWORD('PASS');
FLUSH PRIVILEGES;
```
