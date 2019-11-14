Assuming you have no password SSH set up for the CS machines, the port forwarding works as follows in your IntelliJ terminal:
$ export CS314_ENV=development
$ ssh -v -fNL 56247:faure.cs.colostate.edu:3306 {yourcsuename}@{machine name}.cs.colostate.edu
you may omit the -v if you don't want verbose feedback.

you can test this by running
$ mysql -u cs314-db -h 127.0.0.1 -P 56247 -p
this will prompt you to enter the password: eiK5liet1uej
which will allow you to access the database from your terminal if the port forwarding is working correctly.

When you are finished using the port forwarding, the following command will close the tunnel.
$ kill $(lsof -i:56247)