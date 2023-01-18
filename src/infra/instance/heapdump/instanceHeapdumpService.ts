import { app, BrowserWindow } from 'electron';
import path from 'path';
import { actuatorClientStore } from '../../actuator/actuatorClientStore';
import fs from 'fs-extra';
import { dataSource } from '../../dataSource';
import { HeapdumpReference } from './entities/HeapdumpReference';
import { HasAbility } from '../../utils/hasAbility';
import { systemEvents } from '../../events';
import { InstanceAbility } from '../models/ability';

class InstanceHeapdumpService {
  private readonly heapdumpPath: string = path.join(app.getPath('userData'), 'heapdumps');

  private readonly repository = dataSource.getRepository(HeapdumpReference);

  @HasAbility('heapdump')
  async getHeapdumps(instanceId: string): Promise<HeapdumpReference[]> {
    return this.repository.find({ where: { instanceId } });
  }

  @HasAbility('heapdump')
  async requestDownloadHeapdump(instanceId: string): Promise<HeapdumpReference> {
    console.log('Downloading heapdump for instance', instanceId, this.heapdumpPath);
    return this.repository.save({ instanceId });
  }

  @HasAbility('heapdump')
  async deleteHeapdump(instanceId: string, referenceId: string) {
    await this.repository.delete({ instanceId, id: referenceId });
  }

  async downloadPendingReferences() {
    const references = await this.repository.find({ where: { status: 'pending' } });
    for (const reference of references) {
      await this.downloadReference(reference);
    }
  }

  private async downloadReference(reference: HeapdumpReference) {
    try {
      reference.status = 'downloading';
      await this.repository.save(reference);
      systemEvents.emit('heapdump-reference-downloading', reference.id);
      const client = actuatorClientStore.getActuatorClient(reference.instanceId);
      const arrayBuffer = await client.heapDump();
      const filePath = path.join(this.heapdumpPath, `${reference.id}.hprof`);
      await fs.mkdirp(this.heapdumpPath);
      await fs.promises.writeFile(filePath, Buffer.from(arrayBuffer));
      reference.status = 'ready';
      reference.path = filePath;
      reference.size = arrayBuffer.byteLength;
      await this.repository.save(reference);
      systemEvents.emit('heapdump-reference-download-complete', reference.id);
    } catch (e: unknown) {
      reference.status = 'error';
      reference.statusMessage = String(e);
      await this.repository.save(reference);
      systemEvents.emit('heapdump-reference-download-failed', reference.id, String(e));
    }
  }
}

export const instanceHeapdumpService = new InstanceHeapdumpService();
