import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

PUBLISH = Path(__file__).with_name('publish-preview.py')

class PublishTests(unittest.TestCase):
    def test_release_switch_and_preserved_previous(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            dist = root / 'dist'
            dist.mkdir()
            (dist / 'index.html').write_text('first')
            deploy = root / 'preview'
            def publish(sha):
                return subprocess.run([sys.executable, str(PUBLISH), str(dist), sha,
                                       '--root', str(deploy)], capture_output=True)
            self.assertEqual(publish('a' * 40).returncode, 0)
            self.assertEqual((deploy / 'current/index.html').read_text(), 'first')
            (dist / 'index.html').write_text('second')
            self.assertEqual(publish('b' * 40).returncode, 0)
            self.assertEqual((deploy / 'previous/index.html').read_text(), 'first')
            self.assertEqual(json.loads((deploy / 'current/release.json').read_text())['revision'], 'b' * 40)
            self.assertNotEqual(publish('b' * 40).returncode, 0)
            self.assertEqual((deploy / 'current/index.html').read_text(), 'second')
            (dist / 'external').symlink_to(root)
            self.assertNotEqual(publish('c' * 40).returncode, 0)
            self.assertEqual((deploy / 'current/index.html').read_text(), 'second')

if __name__ == '__main__':
    unittest.main()
