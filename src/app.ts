import { FsInput } from './backup/ports/FsInput';
import { compare } from './backup/scenarios/backup.compare';

// renameJpg('/tmp/pic').catch(console.error);
compare('./d1', './d2', new FsInput());
