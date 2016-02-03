pizone
======

A Raspberry Pi based Nintendo Zone access point.

Create by Mike Chambers (mikechambers@gmail.com)

[https://github.com/mikechambers/pizone](https://github.com/mikechambers/pizone)

pizone creates a Nintendo Zone access point that has the capability of spoofing known access points around the world, allowing you to unlock location specific items, or make Street Pass contacts with people around the world.

Features:

* Creates a portable Nintendo Zone access point
* Can loop through known Nintendo Zone access points to allow you to make Street Pass contacts from around the world (list can be customized).
* Web based interface to monitor status, and tweak some settings

Note, this project is not being actively developed (although I am working to improve the documentation).

<img src="screenshots/1_status.png?raw=true" width="250" />

You can view additional screenshots [here](https://github.com/mikechambers/pizone/tree/master/screenshots).


# Setup

There are a couple of steps to getting pizone to run:

1. Configure Raspberry Pi to act as a wireless access point
2. Install and configure NodeJS
3. Install and run pizone

You can find more detail info below, but the docs and instructions still need a lot of work.

## Hardware

Below is the hardware that I bought to set this up (and which has been tested with the current code). Note, the links below are affiliate links (so I get a small amount when you purchase from them). If you don’t want to support the project, then just remove the affiliate ID in the URL.

* [Raspberry Pi Model B](http://amzn.to/1JUg2Wq)
* [SD Memory Card](http://amzn.to/1JUg8NP) (4 gigs to be safe)
* [UBS Wifi](http://amzn.to/1QDgace)
* [Case](http://amzn.to/1QDgZSv)

Note, I am using a USB Wifi Adapter (linked above) that uses Ralink RT5370 chipset which worked for me without having to install any additional drivers. However, these adapters are pretty cheap in general, and even if you buy two from the same place, you may get different chipsets and thus different results.

Depending on the Wifi adapter you get, you may need to do some additional configuration (install drivers) in order to get it to work.

You can find a listing and discussion of Raspberry Pi and various USB WiFi adapters at:

[http://elinux.org/RPi_USB_Wi-Fi_Adapters](http://elinux.org/RPi_USB_Wi-Fi_Adapters)

## Configuration

Install Raspbian from : [http://www.raspberrypi.org/downloads](http://www.raspberrypi.org/downloads)

The default username and password is:  

**Username**: pi  
**Password** : raspberry

This configuration assumes that the username will stay the same. If you update it, make sure to note the new name if the user name is referenced below.

By default, the root account does not have a root password, and thus you cannot log into root. I would suggest creating a root password in order to be able to recover from any errors accidentally made from the sudoers file. In general, you will not need to log into the root account, but instead will run commands with elevated privileges via the `sudo` command.

In order to create a root account password, run:

    sudo passwd

The default root password for the image distribution is “pizoneroot”.

Next, you should disable root login via SSH:

Edit */etc/ssh/sshd_config* and make sure that the following option is set (if it doesn’t exist, you can add it):

    PermitRootLogin no

Next, run *raspi-config* (if it didn’t run automatically the first time you booted):

    sudo raspi-config

Set the hostname to “pizone”, and enable SSH.

Note, for reference, you can find info on how to set the hostname outside of `raspi-config` [here](http://www.howtogeek.com/167195/how-to-change-your-raspberry-pi-or-other-linux-devices-hostname/).

## Configure Access Point

At this point, you should be able to boot into the raspberry pi and SSH in (hint, when the raspberry pi boots up, it prints it's IP to the screen. More info below on how to configure the IP).

Follow the directions at:

[http://elinux.org/RPI-Wireless-Hotspot](http://elinux.org/RPI-Wireless-Hotspot)

in order to configure your raspberry pi to act as a Nintendo Zone access point. We will tweak some of the configurations, but before you move on, you should make sure that the raspberry pi is working as an access point, and you are able to connect to it, and get on-line through it.

Note, pizone will automatically change the SSID, with the most common one being "attwifi".

## Setup Network

### IP Address

While not necessarily required, especially if you configure Bonjour (see below), it can be very useful to configure the raspberry pi with a static IP. This way, you can connect to it via a web browser or SSH at any time. This can be done on the raspberry pi, or via configuration in your router.

Below is my `/etc/network/interfaces` network configuration file. This is after I have configured my Pi as an access point, and includes setting the ethernet connection to have a static IP that works on my network (you may need to use a different IP).

Note, you only need to update this again if you want to give your Raspberry Pi a static IP.

	auto lo
	auto wlan0

	iface lo inet loopback

	#ethernet
	iface eth0 inet static
	address 192.168.1.159
	netmask 255.255.255.0
	gateway 192.168.1.1

	#wifi
	iface wlan0 inet static
	address 192.168.42.1
	netmask 255.255.255.0

	up iptables-restore < /etc/iptables.ipv4.nat

I also bound the PI's Ethernet MAC address to the ip address on my router.

### Bonjour

Next, we want to setup Bonjour to make it easier to locate the raspberry pi on the network. This step is optional, especially if you give the pi a static IP (see below), but in general, it is useful.

Run the following commands to install and un the avahi bonjour service:

    sudo apt-get install avahi-daemon
    sudo update-rc.d avahi-daemon defaults

Next, edit `/etc/avahi/services/multiple.service` and enter the following:

	<?xml version="1.0" standalone='no'?>
	<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
	<service-group>
	        <name replace-wildcards="yes">%h</name>
	        <service>
	                <type>_device-info._tcp</type>
	                <port>0</port>
	                <txt-record>model=RackMac</txt-record>
	        </service>
	        <service>
	                <type>_ssh._tcp</type>
	                <port>22</port>
	        </service>
	</service-group>

Finally, restart the service:

    sudo service avahi-daemon restart

You should now be able to reach the raspberry pi via Bonjour using the following name:

    pizone.local

Note, the bonjour name is based on the hostname that you set for the pi.

To SSH into the raspberry pi:

    ssh pi@pizone.local

Or to view in the browser (useful later):

    http://pizone.local

Note, Bonjour works without any configuration on Mac based machines. You can find information on running Bonjour on Windows at [http://www.apple.com/support/bonjour/](http://www.apple.com/support/bonjour/)

## Installation

###node.js

pizone requires [node.js](http://nodejs.org) to be installed, as well as a number of node.js modules.

The current version of pizone has been tested on node.js version [v0.10.22](http://nodejs.org/dist/v0.10.22/node-v0.10.22-linux-arm-pi.tar.gz).

Download node for Raspberry Pi from “Other release files" link on: [http://nodejs.org/download/](http://nodejs.org/download/). NOTE: You need a version that is compiled for "linux-arm". Newer versions of node may not be readily available.

Once downloaded, extract the contents of node and link libraries to the appropriate places. The following commands will work for v0.10.22:

    sudo mkdir /opt/node
    sudo tar xvzf node-v0.10.22-linux-arm-pi.tar.gz
    sudo cp -r node-v0.10.22-linux-arm-pi/* /opt/node
    sudo ln -s /opt/node/bin/node /usr/local/bin/node
    sudo ln -s /opt/node/bin/npm /usr/local/bin/npm

This installs node.js into the */opt/node* directory, and then creates simlinks to the *node* and *npm* binaries.

In order to confirm that node is running, run the following command:

    node —version

This should output the version number:

    v0.10.22


### Install pizone

#### Step 1
Clone pizone from github (or download zip from the project page)

```git clone https://github.com/mikechambers/pizone.git```

The default install assumes pizone is found in: `/home/pi/pizone`

#### Step 2

Create symlinks

```
sudo ln -s /home/pi/pizone/etc/pizone /etc/pizone
sudo ln -s /home/pi/pizone/bin/cmac /usr/local/bin/cmac
sudo ln -s /home/pi/pizone/bin/pizone /usr/local/bin/pizone
sudo ln -s /home/pi/pizone/etc/init.d/pizoned /etc/init.d/pizoned
```

#### Step 3
Start pizone

```
sudo /etc/init.d/pizoned start
```

#### Step 4

Load configuration page. Once pizone is running, it will make a configuration site available at the IP address that the Raspberry PI is connected on. Just load that IP in your browser, you should see the current status. The default admin username / password is pizone / pizone. You can change this in pizone/bin/node/config.js.

#### Step 5

Turn on 3DS, and assuming that you have configured your access point correctly, it should begin to make street pass connections. By default, it will change its Street Pass address every 10 minutes.

## Configuration

### Edit Access List

### Start on boot

In order to have pizone automatically run when the Raspberry Pi boots up, run the following command:

 ```
 sudo update-rc.d pizoned defaults
 ```

Any errors or output from the service will be written to a log file at:

```
/var/log/pizone
```

You can watch the logs in real time by running:

```
tail - f /var/log/pizone
```

Note, the log is cleared each time the pizone service is run at boot.

# Potential Issues

## Error when trying to change Mac Address

If you are seeing the following in the pizone log files:

```
SIOCSIFHWADDR: Device or resource busy - you may need to down the interface
```

you may need to adjust the *ifplugd* daemon to not automatically load the *wlan0* interface.

You can do this by opening the */etc/default/ifplugd* file and editing the two properties below:

```
INTERFACES="eth0"
HOTPLUG_INTERFACES="eth0"
```

Note, that once you make this change, you cannot hot swap the USB WiFi adapter, so make sure that it is plugged in when the Pi is booted up.

One you have saved the changes, reboot the pi, and hopefully the issue is resolved.


# Restrict Clients which can connect
http://hostap.epitest.fi/gitweb/gitweb.cgi?p=hostap.git;a=blob_plain;f=hostapd/hostapd.conf
http://wiki.excito.org/wiki/index.php/MAC_address_filter_for_wireless_network


# Backup

Once you have a stable setup, you can shutoff the raspberry pi, remove the SD, and then create a backup image.

http://ivanx.com/raspberrypi/
http://www.raspberrypi.org/phpBB3/viewtopic.php?f=63&t=52938


# todo

**OS Conf**

* Install firewall (do last)
* Block web access from wireless.

**App Code / Configuration**

* Create command line tool to control app (shuffle, load, reset, etc...)
* Check if we need to restart udhcp
* Check if we need to restart hostapd when updating mac access list
* Should we require root access to run cmd script interface
* On system commands, perhaps print stdout when it occurs, and not batched. That way it will show up better in log files.
* bind web server to ethernet address?
* combine static server and API server.
* add server uptime
* add api that returns time until refresh
* add interval time
* fix date timezone for log

**Interface**

* View current mac / ssid
* View all
* Add mac / ssid
* Change current access point
* View mac addresses that can connect
* Add mac address that can connect to access point
* Mac address change interval
* Time to next change
* Stop rotation (stay on current address / ssid)
* add handlebars for templating

#Random stuff

	{ stack: [Getter/Setter],
	  arguments: undefined,
	  type: undefined,
	  message: 'ENOENT, No such file or directory \'/doesnt/exist\'',
	  errno: 2,
	  code: 'ENOENT',
	  path: '/doesnt/exist' }


	Disable ifplugd
	Change in /etc/default/ifplugd, to this -
	INTERFACES="eth0"
	HOTPLUG_INTERFACES="eth0"
	ARGS="-q -f -u0 -d10 -w -I"
	SUSPEND_ACTION="stop"
	
## Debug commands
* iwconfig - info about current access point
* iw - info about wifi device
* iwconfig wlan0 essid "TEST" - might be able to use to change SSID without rebooting.
* lsusb - find the driver being used.
* sudo cat /var/log/syslog | grep "hostapd\|udhcpd" - errors with hostapd / udhcpd


sudo hostapd_cli wps_config "foo" OPEN NONE ""

ctrl_interface=/var/run/hostapd
ctrl_interface_group=0

http://www.freebsd.org/cgi/man.cgi?query=hostapd_cli&sektion=8
http://ftp.netbsd.org/pub/NetBSD/NetBSD-current/src/external/bsd/wpa/dist/hostapd/README-WPS
http://hostap.epitest.fi/gitweb/gitweb.cgi?p=hostap.git;a=blob_plain;f=hostapd/hostapd.conf