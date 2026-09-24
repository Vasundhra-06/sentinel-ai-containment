import socket
import ipaddress
import urllib.parse
from typing import Tuple

class SSRFProtectionService:
    """
    Guarantees strict SSRF protection for authorized external URL fetching.
    Blocks private networks, loopbacks, link-local, and cloud metadata endpoints.
    """
    BLOCKED_NETWORKS = [
        ipaddress.ip_network("0.0.0.0/8"),
        ipaddress.ip_network("10.0.0.0/8"),
        ipaddress.ip_network("127.0.0.0/8"),
        ipaddress.ip_network("169.254.0.0/16"), # link-local & AWS/GCP/Azure metadata
        ipaddress.ip_network("172.16.0.0/12"),
        ipaddress.ip_network("192.168.0.0/16"),
        ipaddress.ip_network("::1/128"),
        ipaddress.ip_network("fc00::/7"),
        ipaddress.ip_network("fe80::/10"),
    ]

    ALLOWED_SCHEMES = {"http", "https"}

    @classmethod
    def validate_url(cls, url: str) -> Tuple[bool, str]:
        try:
            parsed = urllib.parse.urlparse(url)
            if not parsed.scheme or parsed.scheme.lower() not in cls.ALLOWED_SCHEMES:
                return False, f"Unsupported URL protocol scheme '{parsed.scheme}'. Only HTTP and HTTPS are permitted."

            hostname = parsed.hostname
            if not hostname:
                return False, "Invalid or missing URL hostname."

            # Resolve DNS
            addr_info = socket.getaddrinfo(hostname, None)
            for item in addr_info:
                ip_str = item[4][0]
                ip = ipaddress.ip_address(ip_str)
                for blocked in cls.BLOCKED_NETWORKS:
                    if ip in blocked:
                        return False, f"Access to private, loopback, or metadata network IP {ip_str} is strictly prohibited."

            return True, "URL validated as safe for external ingestion."
        except socket.gaierror:
            return False, f"Failed to resolve DNS for hostname '{hostname}'."
        except Exception as e:
            return False, f"URL security validation error: {str(e)}"
