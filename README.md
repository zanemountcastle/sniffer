# sniffer
This project is designed to expose the personal information individuals' devices are constantly broadcasting without their knowledge or explicit consent.

## How it works
Sniffer continously queries the network for mDNS packets broadcasted to all network devices. Within a mDNS Standard Query Response packet is device-identifying information including the IPv6 address, MAC address, and the device's name. Since the device's name is often automatically set as the owner's name, `sniffer` can identify passing individuals by name.
