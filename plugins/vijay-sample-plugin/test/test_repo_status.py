import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "server"))

from repo_status import get_repository_status  # noqa: E402


REPOSITORY_PATH = Path(__file__).resolve().parents[3]


class RepoStatusTests(unittest.TestCase):
    def test_returns_read_only_repository_status(self) -> None:
        result = get_repository_status(str(REPOSITORY_PATH))

        self.assertEqual(result["repository_path"], str(REPOSITORY_PATH))
        self.assertIsInstance(result["branch"], str)
        self.assertIn("changed_files", result)
        self.assertIsInstance(result["changed_files"], list)

    def test_rejects_a_non_git_directory(self) -> None:
        with self.assertRaisesRegex(ValueError, "Git working tree"):
            get_repository_status("/private/tmp")


if __name__ == "__main__":
    unittest.main()
