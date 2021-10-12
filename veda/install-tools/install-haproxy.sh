sudo apt-get -y install haproxy
sudo cp -i haproxy.cfg /etc/haproxy
haproxy -c -f /etc/haproxy/haproxy.cfg
sudo service haproxy restart
