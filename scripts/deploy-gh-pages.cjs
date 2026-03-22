/**
 * Déploiement GitHub Pages sans le package gh-pages :
 * sous Windows, gh-pages met le clone dans un chemin avec "!" (ex. https!github.com!...)
 * et Git refuse alors `git config` dans ce dossier → erreur remote.origin.url.
 *
 * `npm run deploy` lance d'abord `npm run build` (predeploy).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_URL =
  process.env.GITHUB_REPO_URL ||
  'https://github.com/AdamCodeAccount/Wedding-Gregoria-Marcel.git';
const BRANCH = 'gh-pages';

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');

if (!fs.existsSync(buildDir)) {
  console.error('Erreur : le dossier build/ est absent. Lancez : npm run build');
  process.exit(1);
}

const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'wedding-ghpages-'));
const repoDir = path.join(tmpBase, 'repo');

function run(cmd, cwd = tmpBase) {
  execSync(cmd, { stdio: 'inherit', shell: true, cwd });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

try {
  console.log('→ Clone dans un dossier temporaire (chemin sans caractères problématiques)…');
  try {
    run(`git clone --depth 1 --branch ${BRANCH} "${REPO_URL}" "${repoDir}"`);
  } catch {
    console.log('→ Branche gh-pages introuvable ou erreur : clone branche par défaut…');
    run(`git clone --depth 1 "${REPO_URL}" "${repoDir}"`);
    run('git checkout --orphan gh-pages', repoDir);
    try {
      run('git rm -rf .', repoDir);
    } catch {
      /* dépôt déjà vide */
    }
  }

  for (const name of fs.readdirSync(repoDir)) {
    if (name === '.git') continue;
    fs.rmSync(path.join(repoDir, name), { recursive: true, force: true });
  }

  console.log('→ Copie du dossier build/…');
  copyDir(buildDir, repoDir);

  run('git add -A', repoDir);
  try {
    run('git commit -m "Deploy site"', repoDir);
  } catch {
    console.log('→ Aucun changement à committer.');
  }

  console.log('→ Push vers origin gh-pages (force)…');
  run(`git push origin HEAD:${BRANCH} --force`, repoDir);

  console.log(
    '\n✅ Terminé : https://AdamCodeAccount.github.io/Wedding-Gregoria-Marcel/'
  );
} finally {
  try {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}
