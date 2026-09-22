const $ = id => document.getElementById(id), players = window.PLAYERS;
const eur = v => `€${(v / 1e6).toFixed(v >= 100e6 ? 0 : 1)}m`;
const age = dob => Math.floor((Date.now() - new Date(dob)) / (31557600000));
const sel = $('playerSelect'); players.forEach((p, i) => sel.add(new Option(p.name, i)));
function selected() { return players[+sel.value] }
function updatePlayer() { const p = selected(); $('avatar').src = p.img; $('pname').textContent = p.name; $('pmeta').textContent = `${p.club} · ${p.pos} · ${age(p.dob)} years`; $('baseValue').textContent = `MARKET ${eur(p.value)}`; calculate(); }
function val(id) { return +$(id).value }
function calculate() {
  const p = selected(), a = age(p.dob), mins = val('minutes'), ga = val('ga'), form = val('form'), demand = val('demand'), momentum = val('momentum'), contract = +$('contract').value;
  const ageFactor = a < 22 ? 1.17 : a < 26 ? 1.10 : a < 29 ? 1.03 : a < 32 ? .92 : .75;
  const formFactor = .84 + form / 500, availability = .91 + Math.min(mins, 3200) / 36000, output = 1 + Math.min(ga, 45) / 340, market = 1 + momentum / 180 + (demand - 50) / 700;
  const projection = p.value * ageFactor * formFactor * availability * output * market * contract;
  const pct = (projection / p.value - 1) * 100, confidence = Math.min(93, 57 + Math.round(mins / 160) + Math.round((form + demand) / 14));
  $('projected').textContent = eur(projection); $('range').textContent = `Likely range ${eur(projection * .87)} — ${eur(projection * 1.13)}`; $('delta').textContent = `${pct >= 0 ? '↑' : '↓'} ${Math.abs(pct).toFixed(1)}% vs. market value`; $('confidence').textContent = `${confidence}%`;
  const fs = [['Age / potential', (ageFactor - 1) * 100], ['Form score', (formFactor - 1) * 100], ['Production', (output - 1) * 100], ['Market momentum', (market - 1) * 100], ['Contract', (contract - 1) * 100]];
  $('factors').innerHTML = fs.map(([n, x]) => `<div class="factor"><span>${n}</span><div class="bar"><b class="${x >= 0 ? 'positive' : ''}" style="width:${Math.min(100, Math.abs(x) * 3.5 + 12)}%"></b></div><em>${x >= 0 ? '+' : ''}${x.toFixed(1)}%</em></div>`).join('');
}
['form', 'demand', 'momentum'].forEach(id => $(id).addEventListener('input', () => { $(id + 'Out').textContent = id === 'momentum' ? `${val(id) > 0 ? '+' : ''}${val(id)}%` : `${val(id)} / 100`; calculate() }));
['minutes', 'ga', 'contract'].forEach(id => $(id).addEventListener('input', calculate)); sel.addEventListener('change', updatePlayer); $('run').addEventListener('click', calculate);
function renderRows() { const current = selected(); const shortlist = players.filter(p => p.name !== current.name).sort(() => Math.random() - .5).slice(0, 5); $('rows').innerHTML = shortlist.map(p => `<tr><td><div class="mini-player"><img src="${p.img}" alt="">${p.name}</div></td><td>${p.club}</td><td class="pos">${p.pos}</td><td class="val">${eur(p.value)}</td><td>${eur(p.peak)}</td></tr>`).join('') }; $('shuffle').onclick = renderRows; sel.addEventListener('change', renderRows); updatePlayer(); renderRows();
