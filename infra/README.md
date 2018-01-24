1. Make a new file with the contents of habitat-www.service at /etc/systemd/system/habitat-www.service.
2. systemctl enable habitat-www
3. systemctl start habitat-www

To tail the logs:

journalctl -fu hab-sup
