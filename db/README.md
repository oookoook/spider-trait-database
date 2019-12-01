# DB Notes and instructions

## Installation

Follow [instructions](https://linuxize.com/post/install-mariadb-on-centos-7/).

```shell
sudo yum install mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo systemctl status mariadb
sudo mysql_secure_installation
```

Mounting (and formatting) the db storage volume:

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
