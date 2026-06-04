commit 2f2f4838a1b59266fb3de77645a683afa2111e2f
Merge: 046ec3eff 692ed9d73
Author: git stash <git@stash>
Date:   Fri Apr 17 15:37:06 2026 +0700

    WIP on main: 046ec3eff UI improvements for Opportunity Board, Kanban filters, and fix Contract page crash

diff --cc lite-erp-ui/src/components/OpportunityForm.jsx
index 56cb0a770,56cb0a770..d29476309
--- a/lite-erp-ui/src/components/OpportunityForm.jsx
+++ b/lite-erp-ui/src/components/OpportunityForm.jsx
@@@ -859,6 -859,6 +859,7 @@@ M├┤ tß║ú: ${lostDesc}`, 'just now', '#f
                          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                              <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600 }}>T├¬n dß╗ïch vß╗Ñ</th>
++                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600 }}>Giß║úi ph├íp VCX</th>
                              <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600 }}>M├┤ tß║ú th├¬m</th>
                              <th style={{ padding: '8px', textAlign: 'center', width: '40px' }}></th>
                            </tr>
@@@ -867,6 -867,6 +868,9 @@@
                            {selectedExpectedServices.map(srv => (
                              <tr style={{ borderBottom: '1px solid #f1f5f9' }} key={srv.id}>
                                <td style={{ padding: '8px', fontWeight: 500, color: '#334155' }}>{srv.name}</td>
++                              <td style={{ padding: '4px 8px' }}>
++                                <input type="text" className="form-control" style={{ width: '100%', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px' }} placeholder="Nhß║¡p giß║úi ph├íp..." value={srv.vcxSolution || ''} onChange={e => setSelectedExpectedServices(prev => prev.map(s => s.id === srv.id ? { ...s, vcxSolution: e.target.value } : s))} />
++                              </td>
                                <td style={{ padding: '4px 8px' }}>
                                  <input type="text" className="form-control" style={{ width: '100%', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px' }} placeholder="Nhß║¡p m├┤ tß║ú..." value={srv.description} onChange={e => setSelectedExpectedServices(prev => prev.map(s => s.id === srv.id ? { ...s, description: e.target.value } : s))} />
                                </td>
@@@ -1193,12 -1193,12 +1197,12 @@@
                      <input type="date" className="form-control" value={formData.contactDate} onChange={e => hf('contactDate', e.target.value)} />
                    </div>
                    <div className="form-group">
--                    <label className="form-label">Th├íng ph├ít h├ánh</label>
++                    <label className="form-label">Th├íng dß╗▒ kiß║┐n ph├ít h├ánh HSMT</label>
                      <input type="month" className="form-control" value={formData.issueMonth} onChange={e => hf('issueMonth', e.target.value)} />
                    </div>
                    <div className="form-group">
--                    <label className="form-label">Th├íng k├╜ hß╗úp ─æß╗ông</label>
--                    <input type="month" className="form-control" />
++                    <label className="form-label">Th├íng dß╗▒ kiß║┐n k├¡ hß╗úp ─æß╗ông</label>
++                    <input type="month" className="form-control" value={formData.contractMonth || ''} onChange={e => hf('contractMonth', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">─Éß║ºu mß╗æi nghiß╗çp vß╗Ñ VCX</label>
@@@ -1261,6 -1261,6 +1265,25 @@@
                </div>
              </div>
  
++            {/* KH├ô KH─éN & ─Éß╗Ç XUß║ñT */}
++            <div className="form-card" style={{ width: '100%', marginBottom: '16px' }}>
++              <div className="column-title-modern">Kh├│ kh─ân, ─æß╗ü xuß║Ñt</div>
++              <div className="extra-info-grid" style={{ paddingBottom: '16px' }}>
++                <div style={{ width: "100%" }}>
++                  <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
++                    <label className="form-label" style={{ marginBottom: '8px', width: '100%' }}>Kh├│ kh─ân</label>
++                    <textarea className="textarea-control" placeholder="Nhß║¡p c├íc kh├│ kh─ân gß║╖p phß║úi..." style={{ minHeight: '80px', width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }} value={formData.difficulties || ''} onChange={e => hf('difficulties', e.target.value)}></textarea>
++                  </div>
++                </div>
++                <div style={{ width: "100%" }}>
++                  <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
++                    <label className="form-label" style={{ marginBottom: '8px', width: '100%' }}>─Éß╗ü xuß║Ñt</label>
++                    <textarea className="textarea-control" placeholder="Nhß║¡p ─æß╗ü xuß║Ñt xß╗¡ l├╜..." style={{ minHeight: '80px', width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }} value={formData.proposals || ''} onChange={e => hf('proposals', e.target.value)}></textarea>
++                  </div>
++                </div>
++              </div>
++            </div>
++
              {/* GHI CH├Ü Nß╗ÿI Bß╗ÿ */}
              <div className="form-card" style={{ width: '100%', marginBottom: '16px' }}>
                <div className="column-title-modern">Ghi ch├║ nß╗Öi bß╗Ö</div>
