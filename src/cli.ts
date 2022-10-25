import path from 'path';
import fse from 'fs-extra';
import fs from 'fs';

const EXAMPLE_DIR = path.resolve(__dirname, '../example');

class Main {
    private static cmdPrefix = 'npx dbcodegen-tools';

    private static usage = `Usage: ${this.cmdPrefix} init [path/to/output/dir]`;

    static async main() {
        const [cmd, ...args] = process.argv.slice(2);
        switch (cmd) {
            case 'init':
                await this.init(args);
                return;
        }
        console.log(this.usage);
    }

    private static async init(args: string[]) {
        if (args.length !== 1) {
            console.log(this.usage);
            return;
        }
        const outDir = path.resolve(process.cwd(), args[0]);
        await fse.copy(EXAMPLE_DIR, outDir);
        const npmIgnore = path.join(outDir, '.npmignore');
        if (fs.existsSync(npmIgnore)) {
            fs.renameSync(npmIgnore, path.join(outDir, '.gitignore'));
        }
        const packageJson = path.join(outDir, 'package.json');
        fs.writeFileSync(
            packageJson,
            fs.readFileSync(packageJson, 'utf-8').replace('file:..', '^1.0.0')
        );
    }
}

Main.main().catch((e) => console.error(e));
